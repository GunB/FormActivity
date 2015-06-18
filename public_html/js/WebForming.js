debugging = false;
(function ($) {

    $.fn.WebForming = function (options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
            config: {
                required: true,
                add_type: [
                    "text", "submit", "email", "range", "radio", "password", "checkbox"
                ]
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
            debugging ? console.log("Settings ", settings, val) : false;

            var typeTag;

            if (isEmpty(val.type)) {
                //return null;
            } else {
                switch (val.type) {
                    case "text":
                    case "email":
                    case "submit":
                    case "range":
                    case "radio":
                    case "checkbox":
                    case "password":
                        typeTag = '<input/>';
                        break;
                        /*case "button":
                         typeTag = '<button/>';
                         break;
                         case "textarea":
                         typeTag = '<textarea/>';
                         break;
                         case "select":
                         typeTag = '<select/>';
                         break;
                         case "option":
                         typeTag = '<option/>';
                         break;*/
                    default:
                        typeTag = '<' + val.type + '/>';
                }
            }

            var element;

            if (isEmpty(val.data)) {
                element = $(typeTag, {name: name});
                debugging ? console.log("Obj element: ", val, element) : false;

                //<editor-fold defaultstate="collapsed" desc="set element values">
                val.value ? element.val(val.value) : false;
                val.text ? element.text(val.text) : false;
                val.html ? element.html(val.html) : false;

                if (val.required) {
                    for (var i = 0; i < settings.add_type.length; i++) {
                        if (settings.add_type[i] === val.type) {

                            val.required ? element.prop("required", true) : settings.required ? element.prop("required", true) : false;
                            val.required ? element.attr("required", true) : settings.required ? element.attr("required", true) : false;

                            break;
                        }
                    }
                }


                for (var i = 0; i < settings.add_type.length; i++) {
                    if (settings.add_type[i] === val.type) {
                        element.attr("type", val.type);
                        break;
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
                    var target = val.data;
                    for (var k in target) {
                        if (target.hasOwnProperty(k)) {
                            var extra_element = create_element(k, target[k], settings);
                            element.append(extra_element);
                        }
                    }
                }


            } else if (!$.isPlainObject(val.data)) {
                element = $(typeTag, {html: val.data});
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

                } else {
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