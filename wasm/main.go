package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"syscall/js"

	"cuelang.org/go/cue"
	"cuelang.org/go/cue/cuecontext"
	"cuelang.org/go/cue/format"
	cueyaml "cuelang.org/go/encoding/yaml"
	"github.com/grafana/thema"
	"github.com/grafana/thema/load"
	"github.com/grafana/thema/vmux"
	"github.com/liamg/memoryfs"
	"gopkg.in/yaml.v3"
)

const (
	yamlFmt       = "yaml"
	jsonFmt       = "json"
	latestVersion = "latest"
)

var rt = thema.NewRuntime(cuecontext.New())

func main() {
	fmt.Println("Go Web Assembly")

	js.Global().Set("validateAny", js.FuncOf(runValidateAny))
	js.Global().Set("validateVersion", js.FuncOf(runValidateVersion))
	js.Global().Set("translateToLatest", js.FuncOf(runTranslateToLatest))
	js.Global().Set("translateToVersion", js.FuncOf(runTranslateVersion))
	js.Global().Set("getLineageVersions", js.FuncOf(runGetLineageVersions))
	js.Global().Set("format", js.FuncOf(runFormat))

	<-make(chan bool)
}

func runValidateVersion(_ js.Value, args []js.Value) any {
	lineage := args[0].String()
	inputData := args[1].String()
	version := args[2].String()

	if lineage == "" || inputData == "" || version == "" {
		return toResult("", errors.New("lineage, input JSON or version is missing"))
	}

	_, datval, err := decodeData(inputData)
	if err != nil {
		return toResult("", err)
	}

	lin, err := loadLineage(lineage)
	if err != nil {
		return toResult("", err)
	}

	return toResult(validateVersion(lin, datval, version))
}

func runValidateAny(_ js.Value, args []js.Value) any {
	lineage := args[0].String()
	inputData := args[1].String()

	if lineage == "" || inputData == "" {
		return toResult("", errors.New("lineage or input JSON is missing"))
	}

	_, datval, err := decodeData(inputData)
	if err != nil {
		return toResult("", err)
	}

	lin, err := loadLineage(lineage)
	if err != nil {
		return toResult("", err)
	}

	return toResult(validateAny(lin, datval))

}

func runTranslateToLatest(_ js.Value, args []js.Value) any {
	lineage := args[0].String()
	inputData := args[1].String()

	if lineage == "" || inputData == "" {
		return toResult("", errors.New("lineage or input JSON is missing"))
	}

	inpFormat, datval, err := decodeData(inputData)
	if err != nil {
		return toResult("", err)
	}

	lin, err := loadLineage(lineage)
	if err != nil {
		return toResult("", err)
	}

	return toResult(translateVersion(lin, datval, latestVersion, inpFormat))
}

func runTranslateVersion(_ js.Value, args []js.Value) any {
	lineage := args[0].String()
	inputData := args[1].String()
	version := args[2].String()

	if lineage == "" || inputData == "" || version == "" {
		return toResult("", errors.New("lineage, input JSON or version is missing"))
	}

	inpFormat, datval, err := decodeData(inputData)
	if err != nil {
		return toResult("", err)
	}

	lin, err := loadLineage(lineage)
	if err != nil {
		return toResult("", err)
	}

	return toResult(translateVersion(lin, datval, version, inpFormat))
}

func runGetLineageVersions(_ js.Value, args []js.Value) any {
	lineage := args[0].String()

	if lineage == "" {
		return toResult("", errors.New("lineage is missing"))
	}

	lin, err := loadLineage(lineage)
	if err != nil {
		return toResult("", err)
	}

	return toResult(lineageVersions(lin))
}

func runFormat(_ js.Value, args []js.Value) any {
	lineage := args[0].String()

	if lineage == "" {
		return toResult("", errors.New("lineage or input JSON is missing"))
	}

	res, err := format.Source([]byte(lineage), format.TabIndent(true))

	return toResult(string(res), err)
}

func toResult(res any, err error) map[string]any {
	var errStr string
	if err != nil {
		errStr = fmt.Sprintf("%s", err)
	}
	return map[string]any{
		"result": res,
		"error":  errStr,
	}
}

func loadLineage(lineage string) (thema.Lineage, error) {
	parts := strings.SplitN(lineage, "\n", 2)
	if !strings.Contains(parts[0], "package") {
		return nil, errors.New("package name is missing")
	}

	packageName := strings.Replace(parts[0], "package ", "", 1)
	moduleContent := `module: "github.com/grafana/` + packageName + `"`

	fs := memoryfs.New()

	// Create cue.mod
	err := fs.MkdirAll("cue.mod", 0777)
	if err != nil {
		panic(err)
	}

	// Create module.cue
	err = fs.WriteFile("cue.mod/module.cue", []byte(moduleContent), 0777)
	if err != nil {
		return nil, err
	}

	err = fs.WriteFile(packageName+".cue", []byte(lineage), 0777)
	if err != nil {
		return nil, err
	}

	inst, err := load.InstanceWithThema(fs, "")
	if err != nil {
		return nil, err
	}

	val := rt.Context().BuildInstance(inst)
	lin, err := thema.BindLineage(val, rt)
	if err != nil {
		return nil, err
	}

	return lin, nil
}

func decodeData(inputData string) (string, cue.Value, error) {
	if inputData == "" {
		return "", cue.Value{}, errors.New("data is missing")
	}

	jd := vmux.NewJSONCodec("stdin")
	yd := vmux.NewYAMLCodec("stdin")

	// Guessing the input format, return the first one that does not fail
	datval, err := jd.Decode(rt.Underlying().Context(), []byte(inputData))
	if err == nil {
		return jsonFmt, datval, nil
	}

	datval, err = yd.Decode(rt.Underlying().Context(), []byte(inputData))
	if err == nil {
		return yamlFmt, datval, nil
	}

	return "", cue.Value{}, fmt.Errorf("failed to decode input data: %w", err)
}

func validateVersion(lin thema.Lineage, datval cue.Value, version string) (string, error) {
	if !datval.Exists() {
		return "", errors.New("cue value does not exist")
	}

	var sch thema.Schema
	if version == latestVersion {
		sch = lin.Latest()
	} else {
		synv, err := thema.ParseSyntacticVersion(version)
		if err != nil {
			return "", err
		}
		sch, err = lin.Schema(synv)
		if err != nil {
			return "", fmt.Errorf("schema version %v does not exist in lineage", synv)
		}
	}

	_, err := sch.Validate(datval)
	if err != nil {
		return "", fmt.Errorf("input does not match version %s", version)
	}

	return fmt.Sprintf("input matches version %s", version), nil
}

func validateAny(lin thema.Lineage, datval cue.Value) (string, error) {
	if !datval.Exists() {
		return "", errors.New("cue value does not exist")
	}

	inst := lin.ValidateAny(datval)
	if inst != nil {
		return fmt.Sprintf("%s", inst.Schema().Version()), nil
	}

	return "", errors.New("input does not match any version")
}

func translateVersion(lin thema.Lineage, datval cue.Value, version string, format string) (string, error) {
	if !datval.Exists() {
		return "", errors.New("cue value does not exist")
	}

	inst := lin.ValidateAny(datval)
	if inst == nil {
		return "", errors.New("input data is not valid for any schema in lineage")
	}

	var tinst *thema.Instance
	var lac thema.TranslationLacunas
	if version == latestVersion {
		tinst, lac = inst.Translate(lin.Latest().Version())
	} else {
		synv, err := thema.ParseSyntacticVersion(version)
		if err != nil {
			return "", err
		}
		tinst, lac = inst.Translate(synv)
	}

	if tinst == nil {
		return "", errors.New("unreachable, thema.Translate() should never return a nil instance")
	}

	raw := tinst.Underlying()
	if !raw.Exists() {
		return "", errors.New("should be unreachable - result should at least always exist")
	}

	if raw.Err() != nil {
		return "", fmt.Errorf("translated value has errors, should be unreachable: %w", raw.Err())
	}

	if !raw.IsConcrete() {
		return "", errors.New("translated value is not concrete (TODO print non-concrete fields)")
	}

	tr := translated{
		from:    inst.Schema().Version().String(),
		to:      tinst.Schema().Version().String(),
		result:  tinst.Underlying(),
		lacunas: lac,
	}

	var result string
	var err error
	switch format {
	case jsonFmt:
		result, err = tr.jsonResult()
	case yamlFmt:
		result, err = tr.yamlResult()
	default:
		return "", errors.New("translation result can't be marshalled to unknown format")
	}

	if err != nil {
		return "", fmt.Errorf("error marshaling translation result to %s: %w", format, err)
	}

	return result, nil
}

func lineageVersions(lin thema.Lineage) (string, error) {
	ver := versions(lin.First(), []string{})
	byt, err := json.Marshal(ver)
	if err != nil {
		return "", fmt.Errorf("error marshaling versions result to JSON: %w", err)
	}

	return string(byt), nil
}

// versions walks the lineage from the first till the latest schema and adds their versions to a slice
func versions(sch thema.Schema, ver []string) []string {
	if sch == nil {
		return ver
	}

	ver = append(ver, sch.Version().String())

	return versions(sch.Successor(), ver)
}

type translationResult struct {
	From    string `json:"from" yaml:"from"`
	To      string `json:"to,omitempty" yaml:"to,omitempty"`
	Result  string `json:"result" yaml:"result"`
	Lacunas string `json:"lacunas" yaml:"lacunas"`
}

type translated struct {
	from    string                   `json:"from"`
	to      string                   `json:"to,omitempty"`
	result  cue.Value                `json:"result"`
	lacunas thema.TranslationLacunas `json:"lacunas"`
}

func (t translated) yamlResult() (string, error) {
	cueStr, err := cueyaml.Encode(t.result)
	if err != nil {
		return "", err
	}

	lac, err := yaml.Marshal(t.lacunas)
	if err != nil {
		return "", err
	}

	tr := translationResult{
		From:    t.from,
		To:      t.from,
		Result:  string(cueStr),
		Lacunas: string(lac),
	}

	result, err := json.MarshalIndent(tr, "", "  ")
	if err != nil {
		return "", err
	}

	return string(result), nil
}

func (t translated) jsonResult() (string, error) {
	cueStr, err := json.MarshalIndent(t.result, "", "  ")
	if err != nil {
		return "", err
	}

	lac, err := json.MarshalIndent(t.lacunas, "", "  ")
	if err != nil {
		return "", err
	}

	tr := translationResult{
		From:    t.from,
		To:      t.from,
		Result:  string(cueStr),
		Lacunas: string(lac),
	}

	result, err := json.MarshalIndent(tr, "", "  ")
	if err != nil {
		return "", err
	}

	return string(result), nil
}
