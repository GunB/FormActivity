debugging = false;
(function ($) {

    $.fn.WebForming = function (form_data, correct, options) {
        if (!isEmpty(this.prop("wf-cdata"))) {
            return;
        }
        // This is the easiest way to have default options.
        var settings = $.extend({}, {
            config: {
                required: true,
                default_webformed: {
                    "class": "webformed"
                },
                default_container: {
                    "type": "div"
                },
                default_label: {
                    "type": "label"
                },
                types: {
                    "text": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true,
                        "type_of_change": "type"
                    }, "submit": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "email": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true,
                        "type_of_change": "type"
                    }, "range": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true,
                        "type_of_change": ""
                    }, "radio": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true,
                        "type_of_change": "check"
                    }, "password": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true,
                        "type_of_change": "type"
                    }, "checkbox": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        //"type_send": "array",
                        "requirable": true,
                        "type_of_change": "check"
                    }, "select": {
                        "add_type": false,
                        "add_name": true,
                        "requirable": true,
                        "type_of_change": "choose"
                    }
                }
            },
            style: {
                //background: "transparent"
            },
            submit_event: function (Object) {
                var jObject = $(Object);

                jObject.on("submit, click", "button, input[type='submit']", function (evt) {
                    evt.preventDefault();
                    var that = $(this).parents("." + config.default_webformed.class);
                    var correct = that.prop("wf-cdata");
                    var results = that.serializeArray();
                    debugging ? console.log(results) : false;

                    var objResps = check_progress(results, correct);
                    debugging ? console.log(objResps) : false;

                    that.trigger({
                        type: "onResult",
                        accepted: objResps.accepted,
                        answers: objResps.answers
                    });

                });
            },
            submit_correct: function (options) {

            },
            submit_incorrect: function (options) {

            }
        }, options);

        this.css(settings.style);

        var config = settings.config;
        debugging ? console.log("Data ", settings) : false;

        var submit_event = settings.submit_event;

        var check_progress = function (values, answers) {
            var objAnswers = {};
            var boolResp = true;

            for (var k in answers) {
                objAnswers[k] = {};

                var check_every_answer = answers[k].match_every_result ? true : false;

                var getted_answers = [];
                var getted_answers_values = [];

                for (var k2 in values) {
                    if (values[k2].name === k) {
                        getted_answers.push(values[k2]);
                        getted_answers_values.push(values[k2].value);
                    }
                }

                var accept;

                if (check_every_answer) {

                    var re = isEmpty(getted_answers_values.join("|")) ?
                            new RegExp("(?=a)b") : new RegExp(getted_answers_values.join("|"));

                    debugging ? console.log(re) : false;

                    for (var k2 in answers[k].expression_results) {
                        accept = (answers[k].expression_results[k2].match(re) !== null);
                        var objAnswer = {
                            value: answers[k].expression_results[k2],
                            name: k,
                            accepted: accept
                        };

                        objAnswers[k][k2] = objAnswer;
                        objAnswers[k].accepted = isEmpty(objAnswers[k].accepted) ?
                                accept : objAnswers[k].accepted ? accept : objAnswers[k].accepted;

                        boolResp = boolResp ? accept : boolResp;
                    }
                } else {
                    var re = new RegExp(answers[k].expression_results.join("|"));
                    debugging ? console.log(re) : false;

                    for (var k2 in getted_answers) {
                        accept = (getted_answers[k2].value.match(re) !== null);
                        getted_answers[k2].accepted = accept;
                        getted_answers[k2].correct_value = re.toString();

                        objAnswers[k][k2] = getted_answers[k2];
                        objAnswers[k].accepted = isEmpty(objAnswers[k].accepted) ?
                                accept : objAnswers[k].accepted ? accept : objAnswers[k].accepted;

                        boolResp = boolResp ? accept : boolResp;
                    }
                }
            }

            objAnswers = {answers: objAnswers, accepted: boolResp};

            return objAnswers;
        };

        //<editor-fold defaultstate="collapsed" desc="Create element">
        var create_element = function (name, val, settings) {
            //debugging ? console.log("form element: ", name, val) : false;
            debugging ? console.log("Creating ", val) : false;

            val.fixed_name ? name = val.fixed_name : false;

            var typeTag;

            var boolIsTypeSpecial = !isEmpty(settings.types[val.type]);
            var objType = boolIsTypeSpecial ? settings.types[val.type] : null;

            //<editor-fold defaultstate="collapsed" desc="Selecting type of element">
            if (isEmpty(val.type)) {
                //return null;
            } else {
                typeTag =
                        boolIsTypeSpecial ?
                        settings.types[val.type].special_tag ?
                        "<" + settings.types[val.type].special_tag + "/>" : "<" + val.type + "/>"
                        : "<" + val.type + "/>";
            }
            //</editor-fold>

            var element;

            element = $(typeTag);
            debugging ? console.log("Obj element: ", val, element) : false;

            //<editor-fold defaultstate="collapsed" desc="set element values">
            val.value ? element.val(val.value) : false;
            val.text ? element.text(val.text) : false;
            val.html ? element.html(val.html) : false;

            /**********************      Checking special data to be setted     ********************/
            if (boolIsTypeSpecial) {
                if (objType.requirable) {
                    val.required ? element.prop("required", true) : settings.required ? element.prop("required", true) : false;
                    val.required ? element.attr("required", true) : settings.required ? element.attr("required", true) : false;
                }
                if (objType.add_type) {
                    element.attr("type", val.type);
                }
                if (objType.add_name) {
                    objType.type_send === "array" ? name = name + "[]" : false;
                    element.attr("name", name);
                }
                
                var check_data = function (data){
                    for (var k in data) {
                        if(!data[k]){
                            return false;
                        }
                    }
                };

                /*********************      Adding events to every element      ********************/
                if (objType.add_name && element.prop("required") && objType.type_of_change) {
                    debugging ? console.warn(name) : false;
                    switch (objType.type_of_change) {
                        case "check":
                            var objProp = settings.default_bind.prop("wf-cquestions");
                            objProp[name] = false;
                            settings.default_bind.prop("wf-cquestions", objProp);

                            element.change(function () {
                                var that = $(this);
                                var objProp = settings.default_bind.prop("wf-cquestions");

                                if (that.is(':checked')) {
                                    objProp[that.attr("name")] = true;
                                } else {
                                    objProp[that.attr("name")] = false;
                                }

                                debugging ? console.log("change check", name, that.is(':checked')) : false;

                                settings.default_bind.prop("wf-cquestions", objProp);
                                settings.default_bind.trigger({
                                    type: "onChange",
                                    state: settings.default_bind.prop("wf-cquestions"),
                                    accepted : check_data(settings.default_bind.prop("wf-cquestions"))
                                });
                            });
                            element.change();
                            break;
                        case "type":
                            var objProp = settings.default_bind.prop("wf-cquestions");
                            objProp[name] = false;
                            settings.default_bind.prop("wf-cquestions", objProp);

                            element.change(function () {
                                var that = $(this);
                                var objProp = settings.default_bind.prop("wf-cquestions");

                                if (that.val().trim() !== "") {
                                    objProp[that.attr("name")] = true;
                                } else {
                                    objProp[that.attr("name")] = false;
                                }

                                debugging ? console.log("type check", name) : false;

                                settings.default_bind.prop("wf-cquestions", objProp);
                                settings.default_bind.trigger({
                                    type: "onChange",
                                    state: settings.default_bind.prop("wf-cquestions"),
                                    accepted : check_data(settings.default_bind.prop("wf-cquestions"))
                                });
                            });
                            element.change();
                            break;
                        case "choose":
                            var objProp = settings.default_bind.prop("wf-cquestions");
                            objProp[name] = false;
                            settings.default_bind.prop("wf-cquestions", objProp);

                            element.change(function () {
                                var that = $(this);
                                var objProp = settings.default_bind.prop("wf-cquestions");

                                var optionSelected = $("option:selected", that);
                                var valueSelected = this.value;

                                if (valueSelected.trim() !== "" && optionSelected !== "") {
                                    objProp[that.attr("name")] = true;
                                } else {
                                    objProp[that.attr("name")] = false;
                                }

                                debugging ? console.log("choose check", name) : false;

                                settings.default_bind.prop("wf-cquestions", objProp);
                                settings.default_bind.trigger({
                                    type: "onChange",
                                    state: settings.default_bind.prop("wf-cquestions"),
                                    accepted : check_data(settings.default_bind.prop("wf-cquestions"))
                                });
                            });
                            element.change();
                            break;
                        default:
                            break;
                    }


                }
            }

            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="Extra data">
            if (!isEmpty(val.class)) {
                element.addClass(val.class);
            }

            if (!isEmpty(val.attr)) {
                var target = val.attr;
                for (var k in target) {
                    if (target.hasOwnProperty(k)) {
                        element.attr(k, target[k]);
                    }
                }
            }
            if (!isEmpty(val.prop)) {
                var target = val.prop;
                for (var k in target) {
                    if (target.hasOwnProperty(k)) {
                        element.attr(k, target[k]);
                    }
                }
            }
            //</editor-fold>

            if (!isEmpty(val.data) && $.isPlainObject(val.data)) {
                if ($.isPlainObject(val.data)) {
                    var target = val.data;
                    for (var k in target) {
                        if (target.hasOwnProperty(k)) {
                            var extra_element = create_element(k, target[k], settings);
                            element.append(extra_element);
                        }
                    }
                } else {
                    element = element.html(val.data);
                }
            }

            if (!isEmpty(val.label)) {
                var temp_element;
                var copy_element = element;
                if (!isEmpty(settings.default_container)) {
                    temp_element = create_element(null, settings.default_container, settings);

                    element = temp_element;
                }
                if ($.isPlainObject(val.label)) {
                    temp_element = create_element(null, val.label, settings);
                } else {
                    var temp_label = $.extend(
                            {},
                            config.default_label,
                            {html: val.label,
                                "attr": {"for": name}}
                    );

                    temp_element =
                            create_element(null, temp_label, config);
                }
                element.append(temp_element);
                element.append(copy_element);
            }

            return element;
        };
        //</editor-fold>

        return this.each(function () {
            var that = $(this);
            that.prop("wf-cdata", correct);
            that.prop("wf-cquestions", {});

            that.addClass(config.default_webformed.class);

            if (!isEmpty(config.default_webformed.container)) {
                var element = create_element(null, config.default_webformed.container, config);
                that.append(element);
                that = element;
            }

            config.default_bind = that;

            submit_event(this);
            // Do something to each element here.
            var target = form_data;
            for (var k in target) {
                var element;
                var thatForm = that;

                if (!isEmpty(target[k].container)) {
                    if ($.isPlainObject(target[k].container)) {
                        element = create_element(null, target[k].container, config);
                    } else {
                        element = create_element(null, {"type": target[k].container}, config);
                    }

                    thatForm.append(element);
                    thatForm = element;
                }

                //<editor-fold defaultstate="collapsed" desc="adding elements with same properties">
                if (!isEmpty(target[k].elements)) {
                    var target_2 = target[k].elements;
                    delete target[k].elements;

                    for (var k2 in target_2) {
                        if (target_2.hasOwnProperty(k2)) {
                            var objTemp = target[k];
                            objTemp.value = k2;
                            objTemp.label = $.extend(
                                    {},
                                    config.default_label,
                                    {"html": target_2[k2],
                                        "attr": {"for": k}}
                            );
                            element = create_element(k, objTemp, config);
                            thatForm.append(element);
                        }
                    }
                }
                //</editor-fold>
                else {
                    element = create_element(k, target[k], config);
                    thatForm.append(element);
                }
            }
        });
    };

    $(document).ready(function () {
        $("[wf-form][wf-data][wf-noextra]").each(function () {
            var that = $(this);
            var url_form = that.attr("wf-form");
            var url_data = that.attr("wf-data");
            var options = null;

            $.when($.getJSON(url_form), $.getJSON(url_data)).done(function (form, data) {
                that.WebForming(form[0], data[0], options);
            });

            that.removeAttr("wf-form");
            that.removeAttr("wf-data");
            that.removeAttr("wf-noextra");
        }).on("onResult", function (evt) {
            debugging ? console.log(evt) : false;

            if (evt.accepted) {
                //Respuesta correcta
            } else {
                //Error en la respuesta
            }
        }).on("onChange", function (evt) {
            debugging ? console.log(evt) : false;
        });
    });

}(jQuery));