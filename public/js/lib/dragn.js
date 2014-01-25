(function (root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd)
		define(factory);
	else
		root.dragn = factory();
})(this, (function () {
	'use strict';

	var util = {
		hasClass: function (node, strClass) {
			return node.className.split(' ').indexOf(strClass) !== -1;
		},
		getCursorOffset: function (e) {
			if (e.pageX === undefined) {
				return {
					left: event.clientX + document.body.scrollLeft,
					top: event.clientY + document.body.scrollTop
				}; 
			}

			return {
				left: e.pageX,
				top: e.pageY
			};
		},
		getPageOffset: function (element) {
			var top = 0;
			var left = 0;

			do {
				top += element.offsetTop || 0;
				left += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);

			return {
				top: top + util.getCurrentPixelStyle(document.body, 'padding-top'),
				left: left + util.getCurrentPixelStyle(document.body, 'padding-left')
			};
		},
		getRelativeOffset: function (element, referenceElement) {
			var elementOffset = util.getPageOffset(element);
			var referenceOffset = util.getPageOffset(referenceElement);
			return {
				top: elementOffset.top - referenceOffset.top,
				left: elementOffset.left - referenceOffset.left
			};
		},
		getBoundingRectangle: function (element) {
			var offset = util.getPageOffset(element);

			return {
				top: offset.top,
				left: offset.left,
				bottom: offset.top + element.offsetHeight,
				right: offset.left + element.offsetWidth
			};
		},
		getCurrentPixelStyle: function (elem, prop) {
			var value = 0;

			if (window.getComputedStyle) {
				value = window.getComputedStyle(elem).getPropertyValue(prop) || 0;
				if (value)
					value = parseInt(value.substring(0, value.length - 2), 10);
			}
			// IE fallback
			else if (elem.currentStyle) {
				// we use 'left' property as a place holder to store values
				var leftCopy = elem.style.left,
					runtimeLeftCopy = elem.runtimeStyle.left;

				value = elem.currentStyle[prop] || 0;
				// assign to runtimeStyle and get pixel value
				elem.runtimeStyle.left = elem.currentStyle.left;
				elem.style.left = (prop === 'fontSize') ? '1em' : value;
				value = elem.style.pixelLeft;

				// restore values for left
				elem.style.left = leftCopy;
				elem.runtimeStyle.left = runtimeLeftCopy;
			}

			return value;
		},
		isPointInRect: function (point, rect) {
			return point.left >= rect.left && point.left <= rect.right &&
				point.top >= rect.top && point.top <= rect.bottom;
		},
		makeUnselectable: function (node) {
			var props = ['-webkit-touch-callout', '-webkit-user-select', '-khtml-user-select', '-moz-user-select', '-ms-user-select', 'user-select'];
			for (var i = 0, ii = props.length; i < ii; i++)
				node.style[props[i]] = props[i] === '-moz-user-select' ? 'moz-none' : 'none';
		},
		position: function (node, x, y) {
			node.style.left = x ? x + 'px' : null;
			node.style.top = y ? y + 'px' : null;
		},
		isParentOf: function (possibleParent, node) {
			while (node.parentElement && node.parentElement !== possibleParent)
				node = node.parentElement;
			return !!node.parentElement; 
		},
		forIn: function (obj, fn) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop))
					fn(prop, obj);
			}
		},
		extend: function (obj, extensions) {
			var result = {};
			util.forIn(obj, function (prop) { result[prop] = obj[prop]; });
			util.forIn(extensions, function (prop) { result[prop] = extensions[prop]; });
			return result;
		}
	};
	var draggingInfo = null;

	return {
		init: function (options) {
			var i, ii;
			var defaults = {
				draggingContextElement: null,
				onDrop: function (dropContainer, draggable, relativeOffset) { },
				getDragElement: function (dragTarget) { return null; },
				getDropElement: function (dragTarget, dropContainer) { return null; }
			};
			var intMax = Math.pow(2, 31) - 1;
			var positionDraggable = function (draggingInfo, mouseEvent) {
				var cursorOffset = util.getCursorOffset(mouseEvent);
				var parentOffset = util.getPageOffset(draggingInfo.node.offsetParent);

				util.position(
					draggingInfo.node,
					(cursorOffset.left - parentOffset.left) + draggingInfo.offsetDiff.x,
					(cursorOffset.top - parentOffset.top) + draggingInfo.offsetDiff.y
				);
			};
			options = util.extend(defaults, options);

			// Listen for drag starts.
			window.addEventListener('mousedown', function (e) {
				var targetPageOffset, cursorOffset;
				var offsetDiff;
				var originalStyles;
				var draggingElement;

				if (e.button === 0 && !draggingInfo && e.target.hasAttribute('data-dragn-draggable')) {
					draggingElement = options.getDragElement(e.target) || e.target;

					// If the user provided a detached element, insert it into the DOM tree.
					if (draggingElement !== e.target && draggingElement.parentNode === null)
						e.target.parentNode.appendChild(draggingElement);

					// Calculate what the difference is between the cursor's position and the drag target's.
					targetPageOffset = util.getPageOffset(e.target);
					cursorOffset = util.getCursorOffset(e);
					offsetDiff = {
						x: targetPageOffset.left - cursorOffset.left,
						y: targetPageOffset.top - cursorOffset.top
					};
					
					originalStyles = {
						position: draggingElement.style.position,
						top: draggingElement.style.top,
						left: draggingElement.style.left
					};
					draggingElement.style.position = 'absolute';
					draggingElement.style['z-index'] = intMax;
					util.makeUnselectable(draggingElement);

					draggingInfo = {
						node: draggingElement,
						offsetDiff: offsetDiff,
						originalStyles: originalStyles,
						originalParent: draggingElement.parentNode
					};

					if (options.draggingContextElement) {
						draggingInfo.originalParent = draggingElement.parentNode;
						draggingElement = draggingElement.parentNode.removeChild(draggingElement);
						options.draggingContextElement.appendChild(draggingElement);
					}

					positionDraggable(draggingInfo, e);
					e.preventDefault();
				}
			}); 

			// Listen for dragging anywhere in the body.
			window.addEventListener('mousemove', function (e) {
				var cursorOffset;
				var parentOffset;

				if (draggingInfo && draggingInfo.node)
					positionDraggable(draggingInfo, e);
			});

			// Listen for drag stop.
			document.body.addEventListener('mouseup', function (e) {
				var containers = document.querySelectorAll('[data-dragn-container]');
				var container, parentContainer;
				var containerRect;
				var cursorOffset;
				var relativeOffset;

				if (draggingInfo) {
					cursorOffset = util.getCursorOffset(e);
					// Figure out which valid droppable container it is in.
					// If it isn't in one, put it back where you found it.
					for (i = 0, ii = containers.length; i < ii; i++) {
						containerRect = util.getBoundingRectangle(containers[i]);
						if (util.isPointInRect(cursorOffset, containerRect) && containers[i] !== draggingInfo.node) {
							container = containers[i];
							break;
						}
						else if (util.isParentOf(containers[i], draggingInfo.node) ||
								containers[i] === draggingInfo.originalParent ||
								util.isParentOf(containers[i], draggingInfo.originalParent)) {
							parentContainer = containers[i];
						}
					}
					container = container || parentContainer;

					// Move the draggable element from its source container to its destination
					relativeOffset = util.getRelativeOffset(draggingInfo.node, container);
					if (!util.isParentOf(container, draggingInfo.node)) {
						draggingInfo.node.parentNode.removeChild(draggingInfo.node);
						container.appendChild(draggingInfo.node);
					}
					util.forIn(draggingInfo.originalStyles, function (prop) {
						draggingInfo.node.style[prop] = draggingInfo.originalStyles[prop];
					});
					options.onDrop(container, draggingInfo.node, relativeOffset);

					draggingInfo = null;
				}
			});
		},
		unbind: function () {
		}
	};
}));
