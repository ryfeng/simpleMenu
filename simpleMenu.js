(function() {
  var jObjectToString = function(jObj) {
    return $('<div>').append(jObj.clone()).html(); 
  };

  var SimpleMenu = window.SimpleMenu = {
    generate: function(oTree, sTextProp, sIdProp, sChildrenProp) {
      var fItemHelper = function(oTree) {
        var jTextDiv = $('<span />', {
          class: 'simpleMenuItem',
          id: oTree[sIdProp],
          text: oTree[sTextProp]
        });
        var children = $('<div />', {
          class: 'simpleMenuMenu',
          html: fMenuHelper(oTree[sChildrenProp])
        });
        return jObjectToString(jTextDiv) + jObjectToString(children);
      };
      var fMenuHelper = function(oChildren) {
        oChildren = oChildren || [];
        return $.map(oChildren, fItemHelper).join('');
      };

      if (oTree[sTextProp]) {
        return jObjectToString($('<div />', {
          class: 'simpleMenuMenu',
          html: fMenuHelper([oTree])
        }));
      } else {
        return fMenuHelper(oTree[sChildrenProp]);
      }
    },
    
    hideAllMenus: function(jElement) {
      jElement.find('.simpleMenuMenu').hide();
      jElement.find('.simpleMenuItem').data('shown', false);
    },
    
    showTreePath: function(jLeaf) {
      if (jLeaf.parent().is('.simpleMenuMenu') && jLeaf.parent().prev().is('.simpleMenuItem')) {
        SimpleMenu.showTreePath(jLeaf.parent().prev());
      }
      jLeaf.parent().prev().data('shown', true);
      jLeaf.parent().show();
    },

    // Applies the click bindings across jElement
    applyBindings: function(jElement, jToggler) {
      jToggler.click(function(e) {
        e.stopPropagation();
        if (jToggler.data('shown')) {
          jToggler.next().hide();
        } else {
          jToggler.next().show();
        }
        jToggler.data('shown', !jToggler.data('shown'));
      });
      jElement.on('click', '.simpleMenuMenu', function(e) {
        e.stopPropagation();
      });
      jElement.on('click', '.simpleMenuItem', function(e) {
        e.stopPropagation();
        if (!$(this).data('shown')) {
          SimpleMenu.hideAllMenus(jElement);
          SimpleMenu.showTreePath($(this));
          var position = $(this).position();
          $(this).next().show()
            .css('left', position.left + $(this).outerWidth())
            .css('top', position.top);
        } else {
          $(this).next().hide();
        }
        $(this).data('shown', !$(this).data('shown'));
      });
      $('html').click(function() {
        SimpleMenu.hideAllMenus(jElement);
        jToggler.data('shown', false);
      });
    },
  };
})();
