(function( $ ) {
	$.fn.bannerScroller = function( options ) {

		return this.each(function() {

			var settings = $.extend({
				leftSelector: '.scroll.left',
				rightSelector: '.scroll.right',
				viewportSelector: '.viewport',
				contentSelector: '.scroller-content',
				itemsSelector: '.item',
				animationIntervalTime: 2000,
				itemNotViewdThreshold: 5,
				callback: function () {}
			}, options );

			var $this = $(this);
			var $left = $this.find(settings.leftSelector);
			var $right = $this.find(settings.rightSelector);
			var $viewport = $this.find(settings.viewportSelector);
			var $content = $this.find(settings.contentSelector);
			var $items = $this.find(settings.itemsSelector);
			var $lastItem = $($items[$items.length-1]);

			var firstShownItem = 0;
			
			var overflowWidth = $content.outerWidth() - $viewport.innerWidth();
			var lastItemRightMargin = parseInt($lastItem.css('margin-left'))
			var lastFirstShownItem = $items.index($items.filter(function(){
				var $item = $(this);
				return Math.round($item.position().left + parseInt($item.css('margin-left'))) <= overflowWidth;
			}).last());
			//last possible firstShownItem

			if ( lastFirstShownItem < 0 ) {
				lastFirstShownItem = $items.length - 1;
			}

			var animationInterval;

			if( overflowWidth > 0 ) {
				animationInterval = setInterval(function(){
					scroll(1);
				}, settings.animationIntervalTime);
			}
			
			$right.add($left).add($content).mouseover(function(){
				clearInterval(animationInterval);
			}).mouseleave(function(){
				clearInterval(animationInterval);
				if( overflowWidth > 0 ) {
					animationInterval = setInterval(function(){
						scroll(1);
					}, settings.animationIntervalTime);
				}
			});

			$right.click(function(){
				scroll(1);
			});

			$left.click(function(){
				scroll(-1);
			});

			function scroll(direction) {
				if( overflowWidth <= 0 ) {
					return;
				}
				var $firstShownItem = $($items[firstShownItem]);
				var $nextItem = $($items[firstShownItem+1]);
				if( firstShownItem === -1 ) {
					if ( direction >= 0 )
					{
						$nextItem = $($items[1]);
					}
					else {
						$nextItem = $($items[lastFirstShownItem+1]);
					}
					// $firstShownItem = $($items[firstShownItem]);
				}
				else if ( direction >= 0 && firstShownItem >= $items.length - 1 ) {
					//cycling last→first
					firstShownItem = 0;
				}
				else if ( direction >= 0 && Math.round($content.outerWidth() - $nextItem.position().left + parseInt($nextItem.css('margin-left'))) >= $viewport.innerWidth() ) {
					//one more to the right available
					firstShownItem++;
				}
				else if ( direction < 0 && firstShownItem > 0 ) {
					//one more to the left available
					firstShownItem--;
				}
				else if ( direction >= 0 ) {
					firstShownItem = 0;
				}
				else {
					firstShownItem = -1;
				}

				var overflowRight = -1;

				if ( firstShownItem === -1 ) {
					if ( direction >= 0 )
					{
						firstShownItem = 0;
					}
					else {
						firstShownItem = lastFirstShownItem;
					}
				}
				else {
					overflowRight = $content.outerWidth() - $firstShownItem.position().left - parseInt($firstShownItem.css('margin-left')) - $viewport.innerWidth();
				}

				var $nextShownItem = $($items[firstShownItem]);

				if ( ( overflowRight !== -1 && firstShownItem >= 0 && direction >= 0 &&
						( overflowRight < $lastItem.outerWidth() && overflowRight > lastItemRightMargin + settings.itemNotViewdThreshold ) ) ||
						( direction < 0 && firstShownItem === -1 ) ) {
					//binding right border of the last item to the right border of viewport
					offset = ( $content.outerWidth() - $viewport.innerWidth() ) * -1;
					firstShownItem = -1;
				}
				else {
					offset = ( $nextShownItem.position().left + parseInt($nextShownItem.css('margin-left')) ) * -1;
				}

				$content.stop().animate({
					left: offset
				}, 500, function(){
					if (typeof settings.callback === 'function') {
						settings.callback.call(this);
					}
				});
			}
		});
	};
}( jQuery ));
