if (typeof jQuery === "undefined") {
  alert("The grid displayer requires jQuery + TW Bootstrap or Foundation.");
  
} else {
  // Close grid displayer
  var removeGridDisplayer = function() {  
    jQuery("#grid-displayer-tools").remove();
    jQuery("#grid-displayer").remove();
  },
  
  // Build grid displayer
  gdIsBuilt = false,
  buildGridDisplayer = function(gridFramework) {
  
    var $gdContainer = jQuery("#grid-displayer .gd-container"),
    $gdRow           = jQuery("#grid-displayer .gd-row"),
    $gdTools         = jQuery("#grid-displayer-tools"),
    colsHtml         = "",
    gridNbcols       = parseInt($gdTools.find("#gdt-nbcols").val());
    
    if (gdIsBuilt) {
      $gdContainer.removeClass().addClass("gd-container");
      $gdRow.removeClass().addClass("gd-row").css("border-right", 0).empty();
      $gdTools.find(".framework-specific").hide();
    }
    
    for(var i = 0; i < gridNbcols; i++) {
      colsHtml += "<div class=\"gd-column\">&nbsp;</div>";
    }
    $gdRow.append(colsHtml); 
    var $gdColumn = $gdRow.find(".gd-column"),
    hasBorder = false;
      
    switch(gridFramework) {
      case 'bo':
        $gdContainer.addClass("container");
        $gdRow.addClass("row");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").css("display", "inline-block");
      break;
      
      case 'bf':      
        $gdContainer.addClass("container-fluid");
        $gdRow.addClass("row-fluid");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").css("display", "inline-block");
      break;
      
      case 'f3':      
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns").filter(":odd").addClass("dontshow"); // 0-based indexing means that, counter-intuitively, :odd selects the 2th element, 4th element, ...    
        hasBorder = true;
      break;
      
      case 'f2':
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns");
      break;
    }
    
    setGridColor($gdTools.find("#gdt-color").val(), hasBorder);
    setGridOpacity($gdTools.find("#gdt-opacity").val(), hasBorder);
    
    if (!gdIsBuilt) {
      $gdTools.find("#gdt-options").css("display", "block"); // as the CSS is loaded after the JS, show() is overwritten by display: none
      $gdTools.find("#gdt-ok").css("display", "block");
      setGridZindex($gdTools.find("#gdt-zindex").val());
      jQuery("#grid-displayer").show();
      gdIsBuilt = true;
    }
  },
  
  // Setters
  setGridColor = function(gridColor, hasBorder) {  
    jQuery("#grid-displayer .gd-column:not(.dontshow)").css("background-color", gridColor);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridOpacity = function(gridOpacity, hasBorder) {  
    jQuery("#grid-displayer .gd-column:not(.dontshow)").css("opacity", gridOpacity);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridZindex = function(gridZindex) {  
    jQuery("#grid-displayer").css("z-index", gridZindex);
  },
  setBorderStyle = function() { // for Foundation 3 only. If only border-opacity existed...
    var currentOpacity = jQuery("#grid-displayer .gd-column:first-child").css("opacity"),
        rgbaColor = jQuery("#grid-displayer .gd-column:first-child").css("background-color").replace('rgb', 'rgba').replace(')',', ' + currentOpacity + ')'); // I'm not proud of this. If you have a nicer solution, your pull request is very welcome.
    jQuery("#grid-displayer .gd-row").css("border-right", "2px solid " + rgbaColor);
  };
  
  if (jQuery("#grid-displayer").length) { // Close grid displayer when the bookmarklet is clicked for a second time
    removeGridDisplayer();    
  } else {
  
    // Default parameters
    var dataGridFramework = jQuery("body").data("grid-framework"),
    dataGridNbcols        = jQuery("body").data("grid-nbcols"),
    dataGridColor         = jQuery("body").data("grid-color"),
    dataGridOpacity       = jQuery("body").data("grid-opacity"),
    dataGridZindex        = jQuery("body").data("grid-zindex"),
    
    gdFramework           = (typeof dataGridFramework === "undefined") ? "" : dataGridFramework,
    gdNbcols              = (typeof dataGridNbcols === "undefined") ?    "12" : dataGridNbcols,
    gdColor               = (typeof dataGridColor === "undefined") ?     "red" : dataGridColor,
    gdOpacity             = (typeof dataGridOpacity === "undefined") ?   "0.3" : dataGridOpacity,
    gdZindex              = (typeof dataGridZindex === "undefined") ?    "0" : dataGridZindex;
    
    // HTML
    var gridHtml = "<div id=\"grid-displayer\" style=\"display: none;\"><div class=\"gd-container\"><div class=\"gd-row\"></div></div></div>",
    frameworks = {"bo": "Bootstrap",
                  "bf": "Bootstrap (fluid)",
                  "f3": "Foundation 3",
                  "f2": "Foundation 2" },
    gridToolsHtml = "<div id=\"grid-displayer-tools\">";
    gridToolsHtml += "  <div class=\"gdt-field\"><select id=\"gdt-framework\">";
    gridToolsHtml += "    <option>&darr; Choose your framework</option>";
    jQuery.each(frameworks, function(key, value) {     
      gridToolsHtml += "<option value=\"" + key + "\"";
      gridToolsHtml += (key == gdFramework) ? " selected" : "";
      gridToolsHtml += ">" + value + "</option>";
    });
    gridToolsHtml += "    <option value=\"tired\">I'm tired of choosing my framework</option>";
    gridToolsHtml += "  </select></div>";
    gridToolsHtml += "  <div id=\"gdt-options\" class=\"gdt-field\">";
    gridToolsHtml += "    <div><label for=\"gdt-color\">Columns colour</label><input type=\"text\" id=\"gdt-color\" value=\"" + gdColor + "\" /></div>";
    gridToolsHtml +=     "<div><label for=\"gdt-opacity\">Opacity</label><input type=\"text\" id=\"gdt-opacity\" value=\"" + gdOpacity + "\" /></div>";
    gridToolsHtml +=     "<div class=\"framework-specific twb\"><label for=\"gdt-nbcols\">Nb cols</label><input type=\"text\" id=\"gdt-nbcols\" value=\"" + gdNbcols + "\" /></div>";
    gridToolsHtml +=     "<div><label for=\"gdt-zindex\">z-index</label><input type=\"text\" id=\"gdt-zindex\" value=\"" + gdZindex + "\" /></div>";
    gridToolsHtml += "  </div>";
    gridToolsHtml += "  <div class=\"gdt-button\" id=\"gdt-ok\"><a href=\"#\">OK</a></div>";
    gridToolsHtml += "  <div class=\"gdt-button\"><a href=\"#\" id=\"gdt-close\">Close</a></div>";
    gridToolsHtml += "</div>";
    
    jQuery("head").append("<link rel='stylesheet' type='text/css' href='http://alefeuvre.github.com/foundation-grid-displayer/stylesheets/gd-bookmarklet.min.css'>");
    jQuery("body").prepend(gridHtml).prepend(gridToolsHtml);  
    jQuery("#grid-displayer-tools").delay(1200).fadeTo("slow",0.1); 
    
    if (typeof dataGridFramework !== "undefined") {
      buildGridDisplayer(gdFramework);
    }
    
    // Actions
    jQuery("#grid-displayer-tools #gdt-framework").change(function() {
      if (jQuery(this).val() == "tired") {
        window.open("http://snipt.net/jiraisurfer/custom-parameters-for-foundation-grid-displayer/");
      } else {
        gdFramework = jQuery(this).val();
        if (gdFramework == "f3" || gdFramework == "f2") {
          jQuery("#grid-displayer-tools #gdt-nbcols").val(12);
        }
        buildGridDisplayer(gdFramework);
      }
    });    
    jQuery("#grid-displayer-tools #gdt-nbcols").change(function() {
      buildGridDisplayer(gdFramework);
    });    
    jQuery("#grid-displayer-tools #gdt-color").change(function() {
      setGridColor(jQuery(this).val(), gdFramework == "f3");
    });    
    jQuery("#grid-displayer-tools #gdt-opacity").change(function() {
      setGridOpacity(jQuery(this).val(), gdFramework == "f3");
    });    
    jQuery("#grid-displayer-tools #gdt-zindex").change(function() {
      setGridZindex(jQuery(this).val());
    });    
    
    jQuery("#grid-displayer-tools #gdt-close").click(function() {
      removeGridDisplayer();
    });
  } 
}
