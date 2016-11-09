backman.directive('bmSidebar', function () {
    return {
        scope: false,
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            iElm.on('click', '.treeview-title', function () {
                var $this = $(this);
                if ($this.parent().hasClass('active')) {
                    $this.parent().removeClass('active').end()
                        .next('ul.treeview-menu').slideUp('fast');
                } else {
                    $this.parent().addClass('active').end()
                        .next('ul.treeview-menu').slideDown('fast');
                }
            });
            var navInitHandler = $scope.$watch('navData', function (newValue, oldValue) {
                if (newValue) {
                    navInitHandler();  //仅运行一次
                    var hash = window.location.hash;
                    setTimeout(function () {
                        iElm.find('.treeview-link').each(function () {
                            var $this = $(this);
                            if ($this.attr('href') == hash) {
                                var $parent1 = $this.parent().parent().show().parent().addClass('active');
                                if ($parent1.hasClass('treeview')) {
                                    var $parent2 = $parent1.parent().show().parent().addClass('active');
                                    if ($parent2.hasClass('treeview')) {
                                        $parent2.addClass('active');
                                    }
                                }
                            }
                        });
                    }, 0);
                }
            });
        }
    }
});