debugging = true;
(function ($) {
    
    $.fn.WebForming = function (options) {
        
        // This is the easiest way to have default options.
        var settings = $.extend({
            default: {
                required: true
            },
            style: {
                background: "transparent"
            }
        }, options);
        
        this.css(settings.style);
        
        return this.each(function () {
            var that = this;
            // Do something to each element here.
            var target = settings.data;
            for (var k in target) {
                var element = create_element(k, target[k]);
                that.append(element);
            }
        });
        
        //<editor-fold defaultstate="collapsed" desc="Create element">
        var create_element = function (name, val) {
            var typeTag;
            
            switch (val.type) {
                case "text":
                case "email":
                case "submit":
                case "range":
                case "radio":
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
                    //debugging ? console.log("unknown form element: " + val) : false;
            }
            
            var element = $(typeTag, {"type": val.type, "name": name});
            //<editor-fold defaultstate="collapsed" desc="set element values">
            val.value ? element.val(val.value) : false;
            val.text ? element.text(val.text) : false;
            val.html ? element.html(val.html) : false;
            val.required ? element.prop("required", true) : settings.default.required ? element.prop("required", true) : false;
            val.required ? element.attr("required", true) : settings.default.required ? element.attr("required", true) : false;
            //</editor-fold>
            
            val.class ? val.class.forEach(function (entry) {
                element.addClass(entry);
            }) : false;
            
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
            
            if (!isEmpty(val.data)) {
                var target = val.data;
                for (var k in target) {
                    if (target.hasOwnProperty(k)) {
                        var extra_element = create_element(k, target[k]);
                        element.append(extra_element);
                    }
                }
            }
            
            return element;
        };
        //</editor-fold>
        
        
    };
    
}(jQuery));