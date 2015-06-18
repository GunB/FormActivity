debugging = true;
(function ($) {

    $.fn.WebForming = function (options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            config: {
                required: true,
                types: {
                    "text": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "submit": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "email": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "range": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "radio": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "password": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "checkbox": {
                        "add_type": true,
                        "add_name": true,
                        "special_tag": "input",
                        "requirable": true
                    }, "select": {
                        "add_type": false,
                        "add_name": true,
                        "requirable": true
                    }
                }
            },
            style: {
                //background: "transparent"
            }
        }, options);

        this.css(settings.style);

        var config = settings.config;
        debugging ? console.log("Data ", settings) : false;

        //<editor-fold defaultstate="collapsed" desc="Create element">
        var create_element = function (name, val, settings) {
            //debugging ? console.log("form element: ", name, val) : false;
            debugging ? console.log("Creating ", val) : false;

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

            if (val.required) {
                if (boolIsTypeSpecial) {
                    if (objType.requirable) {
                        val.required ? element.prop("required", true) : settings.required ? element.prop("required", true) : false;
                        val.required ? element.attr("required", true) : settings.required ? element.attr("required", true) : false;
                    }
                }
            }

            if (boolIsTypeSpecial) {
                if (objType.add_type) {
                    element.attr("type", val.type);
                }
                if (objType.add_name) {
                    element.attr("name", name);
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

            return element;
        };
        //</editor-fold>

        return this.each(function () {
            var that = $(this);
            // Do something to each element here.
            var target = settings.data;
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

                if (!isEmpty(target[k].label)) {
                    element = create_element(null, {type: "label", html: target[k].label, "attr": {"for": k}}, config);
                    thatForm.append(element);
                }

                //<editor-fold defaultstate="collapsed" desc="adding elements with same properties">
                if (!isEmpty(target[k].elements_l)) {
                    var target_2 = target[k].elements_l;
                    for (var k2 in target_2) {
                        if (target_2.hasOwnProperty(k2)) {
                            target[k].value = k2;
                            element = create_element(null, {type: "label", html: target_2[k2], "attr": {"for": k}}, config);
                            thatForm.append(element);
                            element = create_element(k, target[k], config);
                            thatForm.append(element);
                        }
                    }
                } else if (!isEmpty(target[k].elements_r)) {
                    var target_2 = target[k].elements_r;
                    for (var k2 in target_2) {
                        if (target_2.hasOwnProperty(k2)) {
                            target[k].value = k2;
                            element = create_element(k, target[k], config);
                            thatForm.append(element);
                            element = create_element(null, {type: "label", html: target_2[k2], "attr": {"for": k}}, config);
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
        $("[WebForming]").each(function (k, v) {
            var that = $(this);
            $.getJSON(that.attr("WebForming"), function (data) {
                that.WebForming(data);
            });
            that.removeAttr("WebForming");
        });
    });

}(jQuery));