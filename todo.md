# TODO
  - You need to create a template for landing pages
  - Better way for creating icon fonts and how to add the font-face declaration easily
  - You need to define responsive design breakpoints for landing pages
  - You need to create a template for webapplications (more likely learn a yeoman generator and how it works)
  - Make tests
  - Replace modifiers from BEM into is- with- no-, etc. approach.

  - Start using REM/EM approach to scale texts (modify the structure of the fonts here in the scss files).
  - For responsive landing pages, start adjusting the page from the max-width to the min-width (do it the other way around if you're taking a mobile first approach). Then if necessary, start adjusting the height starting from max-height all the way down to the min-height. It's important to note that you should call the mediaqueries inside the typography.scss file generally, since you will be changing the font-size of the html/body elements. Also the order in which you call them is important. It should be always from the max-width declaration, following for its childs from max-height to the min-height.
      Example:
         @mixin media-screen1(){
           @media (max-width: 2200px){
             @content;
           }
         }
         @mixin media-screen1-1(){
           @media (min-width: 2200px) and (max-height: 1000px){
             @content;
           }
         }
         @mixin media-screen1-2(){
           @media (min-width: 2200px) and (max-height: 917px){
             @content;
           }
         }
         @mixin media-screen1-3(){
           @media (min-width: 2200px) and (max-height: 819px){
             @content;
           }
         }
         @mixin media-screen2(){
           @media (max-width: 1280px){
             @content;
           }
         }
         @mixin media-screen3(){
           @media (max-width: 990px){
             @content;
           }
         }
