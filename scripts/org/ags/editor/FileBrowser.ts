
"use strict";

module org.ags.editor {/*
    function findStylesheet(requestedMedia : string, create : boolean) : any {
        var styleSheet : any;
        var mediaType  : string;
        var i          : number;
        
        if (document.styleSheets.length > 0) {
            for (i = 0; i < document.styleSheets.length; i++) {
                if (document.styleSheets[i].disabled) {
                    continue;
                }
                
                var media : any = document.styleSheets[i].media;
                
                mediaType = typeof media;
    
                if (mediaType === "string") {
                    if (media === "" || (media.indexOf(requestedMedia) != -1)) {
                        styleSheet = document.styleSheets[i];
                    }
                }
                else if (mediaType === "object") {
                    if (media.mediaText === "" || (media.mediaText.indexOf(requestedMedia) != -1)) {
                        styleSheet = document.styleSheets[i];
                    }
                }
    
                if (styleSheet !== undefined) {
                    return styleSheet;
                }
            }
        }

        if (create) {
            if (styleSheet === undefined) {
                var styleSheetElement : HTMLStyleElement = <HTMLStyleElement>document.createElement("style");
                
                styleSheetElement.type = "text/css";
        
                document.getElementsByTagName("head")[0].appendChild(styleSheetElement);
                return findStylesheet(requestedMedia, false);
            }
        }
        
        return undefined;
    }
    
    function findStylesheetRule(stylesheet : any, rule : string) : any {
        if (styleSheet["rules"]) {
            for (i = 0; i < styleSheet.rules.length; i++) {
                var rule : any = styleSheet.rules[i];
                
                if (rule.selectorText && rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                    return rule;
                }
            }
        }
        else if (styleSheet["cssRules"]) {
            for (i = 0; i < styleSheet.cssRules.length; i++) {
                var rule : any = styleSheet.cssRules[i];
                
                if (rule.selectorText && rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                    return rule;
                }
            }
        }
        
        return undefined;
    }
    
    function createCSSSelector(selector : string, style : string) : void {
        if (!document.styleSheets) {
            return;
        }
    
        if (document.getElementsByTagName("head").length === 0) {
            return;
        }
    
        var styleSheet : any = findStylesheet("screen", true);
        var rule       : any = findStylesheetRule(styleSheet, selector);
        
        
        var i          : number;


        if (styleSheet["rules"]) {
            for (i = 0; i < styleSheet.rules.length; i++) {
                var rule : any = styleSheet.rules[i];
                
                if (rule.selectorText && rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                    rule.style.cssText = style;
                    return;
                }
            }
    
            styleSheet.addRule(selector, style);
        }
        else if (styleSheet["cssRules"]) {
            for (i = 0; i < styleSheet.cssRules.length; i++) {
                var rule : any = styleSheet.cssRules[i];
                
                if (rule.selectorText && rule.selectorText.toLowerCase() == selector.toLowerCase()) {
                    rule.style.cssText = style;
                    return;
                }
            }
    
            styleSheet.insertRule(selector + "{" + style + "}", 0);
        }
    }*/

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
            initialPage.attr("data-navc-level", 0);
            initialPage.width(w);
            initialPage.height(h);
            controller.attr("data-navc-level", 0);
        }
        else {
            controller.attr("data-navc-level", -1);
        }
        
        RemoveTextNodes(contentDiv[0]);
    }

    function NavigationControllerPush(controller : JQuery, page : any) : void {
        var currentLevel : number         = parseInt(controller.attr("data-navc-level"));
        var contentDiv   : JQuery         = $(".ui-navigationControllerContent", controller)
        var newPage      : HTMLDivElement = document.createElement("div");

        ++currentLevel;
        
        controller.attr("data-navc-level", currentLevel);
        
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
        pageJ.attr("data-navc-level", currentLevel);
        
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
        var currentLevel : number         = parseInt(controller.attr("data-navc-level"));
        var contentDiv   : JQuery         = $(".ui-navigationControllerContent", controller)
        var currentPage  : JQuery         = $(".ui-navigationControllerPage[data-navc-level=" + currentLevel + "]");

        --currentLevel;
        
        controller.attr("data-navc-level", currentLevel);

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
    
    import utils = org.ags.utils;
    
    export interface IFileBrowserDelegate {
        onFileSelected(path : string) : void;
    }
    
    interface FileEntry {
        mtime      : Date;
        ctime      : Date;
        atime      : Date;
        type       : string;
        target     : string;
        targetInfo : FileEntry;
    }
    
    var fileBrowserDelegate : IFileBrowserDelegate;
    
    export class FileBrowser {
        public root : boolean = false;
        public path : string  = "";
        
        constructor(pageNode : JQuery) {
            utils.QueryString.parse(pageNode.attr("data-url"), this);
            
            if (this.root) {
                $("#ags-back-button", pageNode).remove();
            }
            
            var loader : utils.ILoader = new utils.Loader("");
            var node   : JQuery = $("#ags-lv-root", pageNode);
            
            try {
                var info : {} = loader.loadJson(this.path);
                var html : string = "";
                
                for (var entryName in info) {
                    html += "<li>";
                    
                    var entry : FileEntry = info[entryName];
                    
                    while (entry.type === "symlink") {
                        if (entry.targetInfo.type === undefined) {
                            break;
                        }
                        
                        entry = entry.targetInfo;
                    }
                    
                    if (entry.type === "symlink") {
                        // Basically, the symlink doesn't really point to something that exists.
                        entry = info[entryName];
                    }
                    
                    if (entry.type === "directory") {
                        html += "<a  data-transition=\"slide\" href=\"?path=";
                        html += utils.Path.join(this.path, entryName);
                        html += "\">";
                    }

                    html += entryName;
                    
                    if (entry.type === "directory") {
                        html += "</a>";
                    }
                    
                    html += "</li>";
                }
                
                node.html(html);
            }
            catch (e) {
                node.html("<li><a href=\"?path=Error\">Error loading directory content</a></li>");
                console.log(e);
            }
        }
    }
}

$(".ags-lv-entry").bind("click", function(event) {
    $(".ui-navigationController")["navigationController"]("push", "<ul data-role=\"listview\"><li>Second Page</li></ul>")
});

$(document).bind("pagebeforecreate", function(event) {
    $(".ui-navigationController")["navigationController"]();
    
/*    console.log("File Browser Initialized");
    return new org.ags.editor.FileBrowser($(event.target));*/
});
