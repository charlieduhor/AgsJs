
"use strict";

module org.navctl {
    function RemoveTextNodes(content : HTMLElement) {
        var node  : Node   = content.firstChild;
        var nodes : Node[] = [];
        
        while (node) {
            if (node.nodeType === 3) {
                nodes.push(node);
            }
            
            node = node.nextSibling;
        }
        
        for (var nodeI in nodes) {
            content.removeChild(nodes[nodeI]);
        }
    }
    
    function NavigationControllerInit(controller : JQuery) : void {
        var contentDiv : JQuery = $(".ui-navigationControllerContent", controller)
        
        if (contentDiv.length === 0) {
            // No content... Let's create it.
            var newContentDiv = <HTMLDivElement>document.createElement("div");
            
            controller[0].appendChild(newContentDiv);
            contentDiv = $(newContentDiv);
        }
        
        var w : number = controller.width();
        var h : number = controller.height();
        
        contentDiv.addClass("ui-navigationControllerContent");
        contentDiv.width(w + 1);
        contentDiv.height(h);

        var initialPage : JQuery = $(".ui-navigationControllerPage", contentDiv);
        
        if (initialPage.length !== 0) {
            initialPage.addClass("ui-navigationControllerPage");
            initialPage.attr("data-navctl-level", 0);
            initialPage.width(w);
            initialPage.height(h);
            controller.attr("data-navctl-level", 0);
        }
        else {
            controller.attr("data-navctl-level", -1);
        }
        
        RemoveTextNodes(contentDiv[0]);
    }

    function NavigationControllerPush(controller : JQuery, page : any) : void {
        var currentLevel : number         = parseInt(controller.attr("data-navctl-level"));
        var contentDiv   : JQuery         = $(".ui-navigationControllerContent", controller)
        var newPage      : HTMLDivElement = document.createElement("div");

        ++currentLevel;
        
        controller.attr("data-navctl-level", currentLevel);
        
        if (typeof page === "string") {
            newPage.innerHTML += page;
        }
        else {
            newPage.appendChild(page);
        }

        var pageJ : JQuery = $(newPage);
        var w     : number = controller.width();
        
        pageJ.addClass("ui-navigationControllerPage")
        pageJ.width (w);
        pageJ.height(controller.height());
        pageJ.attr("data-navctl-level", currentLevel);
        
        contentDiv.width(((currentLevel + 1) * w) + 50);
        contentDiv[0].appendChild(newPage);
        
        pageJ.trigger("create");
        
        var ccsClassName : string = "slidein-" + w;
        
        contentDiv.css("left", -(currentLevel * w) + "px");
        contentDiv.addClass(ccsClassName);
        
        setTimeout(function() {
            contentDiv.removeClass(ccsClassName);
        }, 151);
        
        setTimeout(function() {
            NavigationControllerPop(controller);
        }, 2000);
    }

    function NavigationControllerPop(controller : JQuery) : void {
        var currentLevel : number         = parseInt(controller.attr("data-navctl-level"));
        var contentDiv   : JQuery         = $(".ui-navigationControllerContent", controller)
        var currentPage  : JQuery         = $(".ui-navigationControllerPage[data-navctl-level=" + currentLevel + "]");

        --currentLevel;
        
        controller.attr("data-navctl-level", currentLevel);

        contentDiv.width(((currentLevel + 1) * w) + 50);

        var w            : number = controller.width();
        var ccsClassName : string = "slideout-" + w;
        
        contentDiv.css("left", -(currentLevel * w) + "px");
        contentDiv.addClass(ccsClassName);

        setTimeout(function() {
            contentDiv.removeClass(ccsClassName);
            contentDiv[0].removeChild(currentPage[0]);
        }, 151);
    }

    jQuery.fn.navigationController = function (command? : string, param1? : any) {
        if ((command === undefined) || (command === "init")) {
            if (this.length === 1) {
                NavigationControllerInit(this);
            }
            else {
                this.each(function() {
                    NavigationControllerInit($(this));
                });
            }
        }
        else if (command === "push") {
            NavigationControllerPush(this, param1);
        }
        else if (command === "pop") {
            NavigationControllerPop(this);
        }
        else {
            throw "Invalid command";
        }
    };
}

$(document).bind("pagebeforecreate", function(event) {
    $(".ui-navigationController")["navigationController"]();
});
