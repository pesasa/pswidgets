/*
 * jquery.pswidgets.js
 * User interface widgets as jQuery-plugin
 * - radio buttons
 *
 * Petri Salmela
 * License: LGPL 2.0 or later
 *
 */

(function($){
    
    /**
     * psradio
     * @param options
     */
    
    $.fn.psradio = function(options) {
        var settings = $.extend({
            colors: [],
            defaultcolor: 'gray',
            circular: false
        }, options);
        
        return this.each(function(){
            var psradio = new Psradio(this, settings);
            psradio.init();
        });
    };
    
    var Psradio = function(place, settings){
        this.inited = false;
        this.place = $(place);
        this.settings = settings;
        this.radios = this.place.find('input[type="radio"]');
        this.labels = [];
        this.colors = [];
        if (this.radios.filter(':checked').length === 0){
            this.selected = 0;
            this.setRadio();
        } else {
            this.selected = this.getRadio();
        }        
        for (var i = 0, length = this.radios.length; i < length; i++){
            this.labels[i] = this.place.find('label[for="'+this.radios.eq(i).attr('id')+'"]').text() || ' ';
            this.colors[i] = (this.availColors.indexOf(this.settings.colors[i]) > -1 ? this.settings.colors[i] : this.settings.defaultcolor);
        };
    };
    
    Psradio.prototype.init = function(){
        var html = '<div class="pswidget-radio">';
        html += '<a href="javascript:;" class="pswidget-radio-nextprev pswidget-radio-firstnp pswidget-roundgradgray">&nbsp;</a>';
        for (var i = 0, length = this.radios.length; i < length; i++){
            html += '<span class="pswidget-radio-item" itemnum="'+i+'">';
            html += this.labels[i];
            html += '</span>';
            html += '<a href="javascript:;" class="pswidget-radio-nextprev pswidget-roundgradgray">&nbsp;</a>';
        }
        html += '</div>';
        this.html = $(html);
        this.html.find('a.pswidget-radio-nextprev').last().addClass('pswidget-radio-lastnp');
        this.place.after(this.html);
        this.items = this.html.find('span.pswidget-radio-item');
        this.firsta = this.html.find('a.pswidget-radio-firstnp');
        this.lasta = this.html.find('a.pswidget-radio-lastnp');
        this.place.hide();
        
        for (var i = 0, length = this.items.length; i < length; i++){
            this.items.eq(i).addClass('pswidget-grad'+this.colors[i]);
        }
        
        if ($('head style#pswidgetradiocss').length < 1){
            $('head').append('<style type="text/css" id="pswidgetradiocss">' + this.strings.css + '</style>');
        }
        this.width = this.getMaxWidth();
        this.items.width(this.width);
        this.outerWidth = this.items.eq(0).outerWidth();
        this.stopwidth = this.firsta.outerWidth();
        this.setEvents();
        this.update();
        this.inited = true;
    };
    
    Psradio.prototype.getMaxWidth = function(){
        var max = 0;
        for (var i = 0, length = this.items.length; i < length; i++){
            max = Math.max(max, this.items.eq(i).width());
        }
        return max;
    }
    
    Psradio.prototype.setEvents = function(){
        var widget = this;
        this.html.find('a.pswidget-radio-nextprev').click(function(){
            var button = $(this);
            var hasclass = button.hasClass('pswidget-radio-gotonext');
            if (hasclass){
                widget.selectNext();
            } else if (button.hasClass('pswidget-radio-gotoprev')){
                widget.selectPrev();
            }
            widget.update();
        });
        
        this.radios.change(function(){
            var index = widget.radios.index($(this));
            widget.selectNum(index);
        });
    }
    
    Psradio.prototype.update = function(){
        if (this.inited){
            this.firsta.animate({'margin-left': -1 * this.selected * (this.outerWidth + this.stopwidth /6)});
            this.lasta.animate({'margin-right': -1 * (this.radios.length - this.selected -1) * (this.outerWidth + this.stopwidth / 6)});
        } else {
            this.firsta.css('margin-left', -1 * this.selected * (this.outerWidth + this.stopwidth /6));
            this.lasta.css('margin-right', -1 * (this.radios.length - this.selected -1) * (this.outerWidth + this.stopwidth / 6));
        }
        this.items.eq(this.selected).prev('a').removeClass('pswidget-radio-gotonext').addClass('pswidget-radio-gotoprev');
        this.items.eq(this.selected).next('a').removeClass('pswidget-radio-gotoprev').addClass('pswidget-radio-gotonext');
    }
    
    Psradio.prototype.selectNum = function(num){
        this.selected = (num + this.radios.length) % this.radios.length;
        this.setRadio();
        this.update();
    }
    
    Psradio.prototype.selectNext = function(){
        this.selected = (this.selected + 1) % this.radios.length;
        this.setRadio();
        this.update();
    }
    
    Psradio.prototype.selectPrev = function(){
        this.selected = (this.selected + this.radios.length - 1) % this.radios.length;
        this.setRadio();
        this.update();
    }
    
    Psradio.prototype.setRadio = function(){
        this.radios.eq(this.selected).attr('checked','checked');
    }
    
    Psradio.prototype.getRadio = function(){
        return this.radios.index(this.radios.filter(':checked'));
    }
    
    Psradio.prototype.availColors = ['red','orange','yellow','green','blue','violet','gray','white','black'];
    
    Psradio.prototype.strings = {
        css: [
            '.pswidget-radio {display: inline-block; border: 1px solid #333; border-radius: 0.5em; background-color: #555; overflow: hidden; white-space: nowrap;}',
            '.pswidget-radio span.pswidget-radio-item {display: inline-block; padding: 0.5em 1em; text-align: center; position: relative; z-index: 1; background-color: white; vertical-align: middle; font-weight: bold; box-shadow: inset 6px 2px 3px rgba(0,0,0,0.5); font-family: sans-serif; color: white; text-shadow: -1px 1px 0px black, 1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black;}',
            '.pswidget-radio a.pswidget-radio-nextprev {display: inline-block; width: 0.8em; padding: 0.6em 0; margin: 0 -0.4em; position: relative; z-index: 2; border: 1px solid #999; border-radius: 0.4em; text-decoration: none; background-color: gold; vertical-align: middle;}',
            '.pswidget-radio a.pswidget-radio-nextprev:first-child {margin-left: 0;}',
            '.pswidget-radio a.pswidget-radio-nextprev:last-child {margin-right: 0;}',
            '.pswidget-gradred {color: white!important; background: rgb(207,4,4);',
                'background: -moz-linear-gradient(top,  rgba(207,4,4,1) 0%, rgba(255,48,25,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(207,4,4,1)), color-stop(100%,rgba(255,48,25,1)));',
                'background: -webkit-linear-gradient(top,  rgba(207,4,4,1) 0%,rgba(255,48,25,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(207,4,4,1) 0%,rgba(255,48,25,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(207,4,4,1) 0%,rgba(255,48,25,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(207,4,4,1) 0%,rgba(255,48,25,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#cf0404\', endColorstr=\'#ff3019\',GradientType=0 );}',
            '.pswidget-gradorange {background: rgb(247,150,33);',
                'background: -moz-linear-gradient(top,  rgba(247,150,33,1) 0%, rgba(249,198,103,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(247,150,33,1)), color-stop(100%,rgba(249,198,103,1)));',
                'background: -webkit-linear-gradient(top,  rgba(247,150,33,1) 0%,rgba(249,198,103,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(247,150,33,1) 0%,rgba(249,198,103,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(247,150,33,1) 0%,rgba(249,198,103,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(247,150,33,1) 0%,rgba(249,198,103,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#f79621\', endColorstr=\'#f9c667\',GradientType=0 );}',
            '.pswidget-gradyellow {background: rgb(241,218,54);',
                'background: -moz-linear-gradient(top,  rgba(241,218,54,1) 0%, rgba(254,252,234,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(241,218,54,1)), color-stop(100%,rgba(254,252,234,1)));',
                'background: -webkit-linear-gradient(top,  rgba(241,218,54,1) 0%,rgba(254,252,234,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(241,218,54,1) 0%,rgba(254,252,234,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(241,218,54,1) 0%,rgba(254,252,234,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(241,218,54,1) 0%,rgba(254,252,234,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#f1da36\', endColorstr=\'#fefcea\',GradientType=0 );}',
            '.pswidget-gradgreen {background: rgb(117,137,12);',
                'background: -moz-linear-gradient(top,  rgba(117,137,12,1) 0%, rgba(164,179,87,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(117,137,12,1)), color-stop(100%,rgba(164,179,87,1)));',
                'background: -webkit-linear-gradient(top,  rgba(117,137,12,1) 0%,rgba(164,179,87,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(117,137,12,1) 0%,rgba(164,179,87,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(117,137,12,1) 0%,rgba(164,179,87,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(117,137,12,1) 0%,rgba(164,179,87,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#75890c\', endColorstr=\'#a4b357\',GradientType=0 );}',
            '.pswidget-gradblue {background: rgb(15,180,231);',
                'background: -moz-linear-gradient(top,  rgba(15,180,231,1) 0%, rgba(169,228,247,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(15,180,231,1)), color-stop(100%,rgba(169,228,247,1)));',
                'background: -webkit-linear-gradient(top,  rgba(15,180,231,1) 0%,rgba(169,228,247,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(15,180,231,1) 0%,rgba(169,228,247,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(15,180,231,1) 0%,rgba(169,228,247,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(15,180,231,1) 0%,rgba(169,228,247,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#0fb4e7\', endColorstr=\'#a9e4f7\',GradientType=0 );}',
            '.pswidget-gradgray {background: rgb(179,190,173);',
                'background: -moz-linear-gradient(top,  rgba(179,190,173,1) 0%, rgba(223,229,215,1) 60%, rgba(252,255,244,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(179,190,173,1)), color-stop(60%,rgba(223,229,215,1)), color-stop(100%,rgba(252,255,244,1)));',
                'background: -webkit-linear-gradient(top,  rgba(179,190,173,1) 0%,rgba(223,229,215,1) 60%,rgba(252,255,244,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(179,190,173,1) 0%,rgba(223,229,215,1) 60%,rgba(252,255,244,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(179,190,173,1) 0%,rgba(223,229,215,1) 60%,rgba(252,255,244,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(179,190,173,1) 0%,rgba(223,229,215,1) 60%,rgba(252,255,244,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#b3bead\', endColorstr=\'#fcfff4\',GradientType=0 );}',
            '.pswidget-gradblack {background: rgb(14,14,14);',
                'background: -moz-linear-gradient(top,  rgba(14,14,14,1) 0%, rgba(125,126,125,1) 100%);',
                'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(14,14,14,1)), color-stop(100%,rgba(125,126,125,1)));',
                'background: -webkit-linear-gradient(top,  rgba(14,14,14,1) 0%,rgba(125,126,125,1) 100%);',
                'background: -o-linear-gradient(top,  rgba(14,14,14,1) 0%,rgba(125,126,125,1) 100%);',
                'background: -ms-linear-gradient(top,  rgba(14,14,14,1) 0%,rgba(125,126,125,1) 100%);',
                'background: linear-gradient(to bottom,  rgba(14,14,14,1) 0%,rgba(125,126,125,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#0e0e0e\', endColorstr=\'#7d7e7d\',GradientType=0 );}',
            '.pswidget-roundgradgray {background: rgb(181,189,200);',
                'background: -moz-radial-gradient(center, ellipse cover,  rgba(181,189,200,1) 0%, rgba(130,140,149,1) 36%, rgba(40,52,59,1) 100%);',
                'background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(181,189,200,1)), color-stop(36%,rgba(130,140,149,1)), color-stop(100%,rgba(40,52,59,1)));',
                'background: -webkit-radial-gradient(center, ellipse cover,  rgba(181,189,200,1) 0%,rgba(130,140,149,1) 36%,rgba(40,52,59,1) 100%);',
                'background: -o-radial-gradient(center, ellipse cover,  rgba(181,189,200,1) 0%,rgba(130,140,149,1) 36%,rgba(40,52,59,1) 100%);',
                'background: -ms-radial-gradient(center, ellipse cover,  rgba(181,189,200,1) 0%,rgba(130,140,149,1) 36%,rgba(40,52,59,1) 100%);',
                'background: radial-gradient(ellipse at center,  rgba(181,189,200,1) 0%,rgba(130,140,149,1) 36%,rgba(40,52,59,1) 100%);',
                'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#b5bdc8\', endColorstr=\'#28343b\',GradientType=1 );}'
        ].join('\n')
    };
    
})(jQuery)