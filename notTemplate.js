//we wil use it to search for proc expressions
jQuery.extend(jQuery.expr[':'], {
    attrStartsWith: function (el, _, b) {
        for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
            if (atts[i].nodeName.indexOf(b[3]) === 0) {
                return true;
            }
        }

        return false;
    }
});

/*
 * Использует DOM поддерево в качестве шаблона.
 * Заполняет его данными.
 * Возвращает сгенерированные элементы
 *
 * */

var notTemplate = function (templateName, //css selector of template
    data, //array of objects or object with data
    helpers //object with helper functions,
) {
    this._notOptions = {
        proccessorIndexAttributeName: 'data-notTemplate-proccindex',
        proccessorExpressionPrefix: 'data-not-',
        proccessorExpressionSeparator: '-',
        proccessorExpressionConditionPostfix: 'if',
        attributeExpressionItemPrefix: ':',
        attributeExpressionHelpersPrefix: '::',
        attributeExpressionFunctionPostfix: '()',
        attributeExpressionDefaultResult: false,
        repeat: data instanceof Array,
        data: data,
        selector: templateName,
        templateElement: $('[data-notTemplate-name="'+templateName+'"]').clone(true, true),
        helpers: helpers,
    };

    this._working = {
        proccessors: [],
        result: null,
        currentEl: null,
        currentItem: null,
        currentIndex: null
    };
    return this;
}

notTemplate.prototype.exec = function () {
    console.log('exec', this);
    if (this._notOptions.repeat) {
        this._proccessItems();
    } else {
        this._working.currentIndex = 0;
        this._working.currentItem = this._notOptions.data;
        this._proccessItem();
        this._working.result = this._working.currentEl.children();
    }
    return this._working.result;
}

notTemplate.prototype._proccessItems = function () {
    console.log('proccessItems');
    var i;
    this._working.result = [];
    for(i = 0; i < this._notOptions.data.length; i++){
        this._working.currentIndex = i;
        this._working.currentItem = this._notOptions.data[i];
        this._proccessItem();
        this._working.result.push(this._working.currentEl.children());
    }
}

notTemplate.prototype._proccessItem = function () {
    console.log('proccessItem');
    this._working.currentEl = this._notOptions.templateElement.clone(true, true);
    this._findAllTemplateProccessors();
    this._execProccessorsOnCurrent();
    console.log(this._working.currentEl.html());
}

//search for proccessors in template, and prepare preInput objects for each
notTemplate.prototype._findAllTemplateProccessors = function () {
    'use strict';
    var elsWithProc = this._working.currentEl.find(':attrStartsWith("' + this._notOptions.proccessorExpressionPrefix + '")'),
        j = null;
    this._working.proccessors = [];
    for (j = 0; j < elsWithProc.length; j++) {
        for (var i = 0, atts = elsWithProc[j].attributes, n = atts.length; i < n; i++) {
            if (atts[i].nodeName.indexOf(this._notOptions.proccessorExpressionPrefix) === 0) {
                console.log(atts[i]);
                var procData = this._parseProccessorExpression(atts[i].nodeName);
                procData.element = $(elsWithProc[j]);
                procData.proccessorExpression = atts[i].nodeName;
                procData.attributeExpression = atts[i].value;
                this._working.proccessors.push(procData);
            }
        }
    }
    console.log('arrange proccessors', this._working.proccessors);
};

notTemplate.prototype._parseProccessorExpression = function (proccessorExpression) {
    var result = {
        params: [],
        proccessorName: '',
        ifCondition: false
    };
    proccessorExpression = proccessorExpression.replace(this._notOptions.proccessorExpressionPrefix, '');
    if (proccessorExpression.indexOf(this._notOptions.proccessorExpressionConditionPostfix) === (proccessorExpression.length - this._notOptions.proccessorExpressionConditionPostfix.length)) {
        result.ifCondition = true;
        proccessorExpression = proccessorExpression.replace(this._notOptions.proccessorExpressionSeparator + this._notOptions.proccessorExpressionConditionPostfix, '');
    }
    result.params = proccessorExpression.split(this._notOptions.proccessorExpressionSeparator);
    result.proccessorName = result.params[0];
    result.params = result.params.slice(1);
    return result;
}

notTemplate.prototype._getAttributeExpressionResult = function (expression, item, index) {
    'use strict';
    var result = null,
        //trying to distinguish what expression is
        //who will be runner
        isHelpers = expression.indexOf(this._notOptions.attributeExpressionHelpersPrefix) === 0,
        isItem = expression.indexOf(this._notOptions.attributeExpressionItemPrefix) === 0,
        //run or get
        isFunction = expression.indexOf(this._notOptions.attributeExpressionFunctionPostfix) === (expression.length - 2),
        //choosing runner
        runner = (isHelpers ? this._notOptions.helpers : item),
        //gettin name of field or function,
        fieldName = expression.replace(this._notOptions.attributeExpressionHelpersPrefix, '') //in current config remove ::
        .replace(this._notOptions.attributeExpressionItemPrefix, '') //--//--//--//--//- remove :
        .replace(this._notOptions.attributeExpressionFunctionPostfix, ''); //--//--//--//--//- remove ()

    if (!isHelpers && !isItem) {
        return expression;
    }

    if (isFunction) {
        result = (runner.hasOwnProperty(fieldName) ? runner[fieldName](item, index) : this._notOptions.attributeExpressionDefaultResult);
    } else {
        result = (runner.hasOwnProperty(fieldName) ? runner[fieldName] : this._notOptions.attributeExpressionDefaultResult);
    }
    return result;
};

notTemplate.prototype._execProccessorsOnCurrent = function () {
    var i;
    console.log('exec proccessors on current');
    for (i = 0; i < this._working.proccessors.length; i++) {
        this._working.proccessors[i].attributeResult = this._getAttributeExpressionResult(this._working.proccessors[i].attributeExpression, this._working.currentItem, this._working.currentIndex);
        if (this.proccessorsLib.hasOwnProperty(this._working.proccessors[i].proccessorName)){
            this.proccessorsLib[this._working.proccessors[i].proccessorName](this._working.proccessors[i]);
            this._working.proccessors[i].element.removeAttr(this._working.proccessors[i].proccessorExpression);
            console.log(this._working.proccessors[i].proccessorExpression,this._working.proccessors[i].element.html());
        }
    }
}

notTemplate.prototype._execProccessorOnCurrentElement = function (proccessor) {
    var i;
}


/*
 * Proccessor takes in input object
 * input - object, with structure like this
 * {
 *      params: [param1|param2|etc],    //params from proccessor expression
 *      conditionIf: true|false,        //true if proccessor expression ends with -if
 *      item: object                    //item to proccess
 *      attributeResult: whatever       //result of attribute expression
 *      element: HTMLElement            //element to modify, for now extended with jQuery
 * }
 *
 * return modified input.element
 *
 */

notTemplate.prototype.proccessorsLib = {
    provider: function (input) {
        'use strict';
        if (input.params.indexOf('capitalize')>-1) input.attributeResult = input.attributeResult.toUpperCase();
        input.element.append(input.attributeResult);
    },
    addclass: function(input){
        if (input.attributeResult){
            input.element.addClass(input.params[0]);
        }
    }
};



