// Simply choose any element and apply the .disableSelection(); method to disable text selection.
$(document).ready(function(){

    $('.notSelectable').disableSelection();
     
 });
 
 $.fn.extend({
     disableSelection: function() {
         this.each(function() {
             this.onselectstart = function() {
                 return false;
             };
             this.unselectable = "on";
             $(this).css('-moz-user-select', 'none');
             $(this).css('-webkit-user-select', 'none');
         });
     }
 });
 