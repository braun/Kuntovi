Element.prototype.toggleVisibility = function (originalDisplayStyle) {
    if(originalDisplayStyle)
        this.originalDisplayStyle = originalDisplayStyle;
    var cdisplay = window.getComputedStyle(this).getPropertyValue("display");
    var visible = cdisplay != "none";
    this.setVisible(!visible);
}

Element.prototype.setVisible = function (visible,originalDisplayStyle) {
    if(originalDisplayStyle)
        this.originalDisplayStyle = originalDisplayStyle;
    if (!(this.hasOwnProperty("originalDisplayStyle")))
        this.originalDisplayStyle = this.style.display; // === "" ? "block" : this.style.display;
    if (visible && this.originalDisplayStyle === "")
        this.style.display ="";
    else
        this.style.display = visible ? this.originalDisplayStyle : "none";
}

Element.prototype.setVisibility = function (visible) {
   
    if (visible)
        this.style.visibility = "initial";
    else
        this.style.visibility = "hidden";
}
Element.prototype.removeAllChildren = function()
{
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
}

function parseColor(input) {
    var div = document.createElement('div'), m;
    div.style.color = input;
    var ccol = div.style.color ;
    m = ccol.split("(")[1].split(")")[0].split(",");
   return m;
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
  }

function TimeoutPoster(timeout)
{
    this.timeout =  timeout==null?100: timeout;
    this.handler = null;
}
TimeoutPoster.prototype.post = function(callback)
{
    if(this.handler != null)
        window.clearTimeout(this.handler);
    
    this.handler == null;
    if(callback ==null)
        return;

    this.handler = window.setTimeout(function()
    {
        this.handler = null;
        callback();
    },this.timeout);
}


function loadResources(cssToLoad,jsToLoad,loadedCallback)
{
    function loadNextJs() {
        if (jsToLoad.length == 0) {
            if(loadedCallback != null)
                loadedCallback();
            return;
        }
        loadJS(jsToLoad.pop(), function (err) {
            if (err != null)
                throw err;
            loadNextJs();

        });
    }
    function loadNextCss() {
        if (cssToLoad.length == 0) {
            loadNextJs();
            return;
        }
        loadCss(cssToLoad.pop(), function (err) {
            if (err != null)
                throw err;
            loadNextCss();

        });
    }
    loadNextCss();
}
var loadJS = function (url, callback) {

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = function (event) {
        callback(null);
    }
    //   scriptTag.onreadystatechange = implementationCode;
    var head = document.getElementsByTagName('head')[0];

    head.appendChild(scriptTag);
};



var loadCss = function (url, callback) {

    var rel = "stylesheet";
    if(url.endsWith("less"))
        rel = "stylesheet/less";
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = rel;
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    if(url.endsWith("less"))
    {
        if(typeof less !== 'undefined')
        {
            less.sheets.push(link);
            less.reload();
        }
        callback(null);
    }
    link.onload = function (event) {
        callback(null);
       
    }
    head.appendChild(link);
}

/**
 * URL encodes the form data
 * @param {Element} form 
 */
function serializeForm(form) {
	if (!form || form.nodeName !== "FORM") {
		return;
	}
	var i, j, q = [];
	for (i = form.elements.length - 1; i >= 0; i = i - 1) {
		if (form.elements[i].name === "") {
			continue;
		}
		switch (form.elements[i].nodeName) {
		case 'INPUT':
			switch (form.elements[i].type) {
			case 'text':
			case 'hidden':
			case 'password':
			case 'button':
			case 'reset':
			case 'submit':
				q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
				break;
			case 'checkbox':
			case 'radio':
				if (form.elements[i].checked) {
					q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
				}						
				break;
			case 'file':
				break;
			}
			break;			 
		case 'TEXTAREA':
			q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
			break;
		case 'SELECT':
			switch (form.elements[i].type) {
			case 'select-one':
				q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
				break;
			case 'select-multiple':
				for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
					if (form.elements[i].options[j].selected) {
						q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
					}
				}
				break;
			}
			break;
		case 'BUTTON':
			switch (form.elements[i].type) {
			case 'reset':
			case 'submit':
			case 'button':
				q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
				break;
			}
			break;
		}
	}
	return q.join("&");
}