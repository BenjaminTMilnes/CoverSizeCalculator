
class CoverLayout {
    constructor() {

        this.pageWidth = 300;
        this.pageHeight = 500;
        this.paperThickness = 0.1;
        this.numberOfPages = 350;
        this.bleed = 10;

        this.centre = v2(500, 500);

        this.showCoverCentres = true;
    }

    get spineWidth() {
        return this.paperThickness * this.numberOfPages;
    }

    update() { }

    drawMeasureLine(graphics, from, to, labelText = "") {
        var s = to.subtract(from);
        var u = s.u;
        var n = u.n;

        var c = "hsla(220, 60%, 70%, 1)";

        graphics.drawPath([from.add(n.times(5)), from.add(n.times(-5))], "none", c, 1);
        graphics.drawPath([from, to], "none", c, 1);
        graphics.drawPath([to.add(n.times(5)), to.add(n.times(-5))], "none", c, 1);
    }

    drawVerticalGuide(graphics, x, colour) {
        var a = 5000;

        graphics.drawPath([v2(x, -a), v2(x, a)], "none", colour, 1, [10, 5]);
    }

    drawHorizontalGuide(graphics, y, colour) {
        var a = 5000;

        graphics.drawPath([v2(-a, y), v2(a, y)], "none", colour, 1, [10, 5]);
    }

    draw(graphics) {
        var b = 100;
        var c = "hsla(220, 60%, 70%, 1)";
        var c2 = "hsla(350, 60%, 70%, 1)";

        var e1 = this.centre.add(v2(-this.spineWidth / 2 - this.pageWidth - this.bleed, -this.pageHeight / 2 - this.bleed));
        var e2 = e1.add(v2(this.pageWidth * 2 + this.spineWidth + this.bleed * 2, 0));
        var e3 = e2.add(v2(0, this.pageHeight));
        var e4 = e1.add(v2(0, this.pageHeight));

        var e5 = e1.add(v2(this.pageWidth + this.bleed, 0));
        var e6 = e5.add(v2(this.spineWidth, 0));
        var e7 = e6.add(v2(0, this.pageHeight));
        var e8 = e5.add(v2(0, this.pageHeight));

        var e9 = e1.add(v2(this.bleed, this.bleed));
        var e10 = e2.add(v2(-this.bleed, this.bleed));
        var e11 = e3.add(v2(-this.bleed, - this.bleed));
        var e12 = e4.add(v2(this.bleed, - this.bleed));

        var e13 = e9.add(v2(this.pageWidth / 2));
        var e14 = e10.add(v2(- this.pageWidth / 2));

        graphics.drawPath([e1, e2, e3, e4, e1], "rgba(32, 32, 32, 1)", "black", 0);
        graphics.drawPath([e5, e6, e7, e8, e5], "rgba(48, 48, 48, 1)", "black", 0);

        this.drawVerticalGuide(graphics, e1.x, c);
        this.drawVerticalGuide(graphics, e5.x, c);
        this.drawVerticalGuide(graphics, e6.x, c);
        this.drawVerticalGuide(graphics, e2.x, c);

        this.drawHorizontalGuide(graphics, e1.y, c);
        this.drawHorizontalGuide(graphics, e4.y, c);

        if (this.bleed > 0) {
            this.drawVerticalGuide(graphics, e9.x, c);
            this.drawVerticalGuide(graphics, e10.x, c);
            this.drawHorizontalGuide(graphics, e9.y, c);
            this.drawHorizontalGuide(graphics, e12.y, c);
        }

        if (this.showCoverCentres) {
            this.drawVerticalGuide(graphics, e13.x, c2);
            this.drawVerticalGuide(graphics, e14.x, c2);
        }

        this.drawMeasureLine(graphics, e1.add(v2(-b, 4)), e4.add(v2(-b, -4)), "Total Height");
        this.drawMeasureLine(graphics, e1.add(v2(4, -b)), e2.add(v2(-4, -b)), "Total Width");
        this.drawMeasureLine(graphics, e5.add(v2(4, -b / 2)), e6.add(v2(-4, -b / 2)), "Spine Width");

        graphics.drawText("Front Cover", e14.add(v2(0, this.pageHeight / 2)), "middlecentre", 0, "Book Antiqua", 30, "#F0F0F0");
        graphics.drawText("Back Cover", e13.add(v2(0, this.pageHeight / 2)), "middlecentre", 0, "Book Antiqua", 30, "#F0F0F0");
        graphics.drawText("Spine".toUpperCase(), e5.add(v2(this.spineWidth / 2, this.pageHeight / 8)), "middlecentre", 90, "Book Antiqua", 15, "#F0F0F0");

        graphics.drawText("Left Spine Edge".toUpperCase(), e5.add(v2(-5, this.pageHeight / 2)), "bottomcentre", -90, "Arial", 10, c);
        graphics.drawText("Right Spine Edge".toUpperCase(), e6.add(v2(5, this.pageHeight / 2)), "bottomcentre", 90, "Arial", 10, c);

        graphics.drawText("Left Bleed Edge".toUpperCase(), e9.add(v2(5, -this.bleed + this.pageHeight / 2)), "bottomcentre", 90, "Arial", 10, c);
        graphics.drawText("Right Bleed Edge".toUpperCase(), e10.add(v2(-5, -this.bleed + this.pageHeight / 2)), "bottomcentre", -90, "Arial", 10, c);
        graphics.drawText("Top Bleed Edge".toUpperCase(), e9.add(v2(this.pageWidth / 10, 5)), "topleft", 0, "Arial", 10, c);
        graphics.drawText("Bottom Bleed Edge".toUpperCase(), e12.add(v2(this.pageWidth / 10, -5)), "bottomleft", 0, "Arial", 10, c);

        if (this.showCoverCentres) {
            graphics.drawText("Front Cover Centre".toUpperCase(), e14.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, c2);
            graphics.drawText("Back Cover Centre".toUpperCase(), e13.add(v2(-5, this.pageHeight / 4)), "bottomcentre", -90, "Arial", 10, c2);
        }
    }
}

var l = new CoverLayout();

class AppEvent {
    constructor(pointOnScreen) {
        this.pointOnScreen = pointOnScreen;
        this.isConsumed = false;
    }

    get p() {
        return this.pointOnScreen;
    }
}

class App extends Application {
    constructor(canvasId) {
        super(canvasId);

        this.resolutionFactor = 1;

        this.elements = [];
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);

        l.centre = v2(this.width / 2, this.height / 2);

        this.elements.push(l);
    }

    getPointOnScreen(event) {
        var x = event.clientX - this.canvasLeft;
        var y = event.clientY - this.canvasTop;

        return v(x, y);
    }

    getAppEvent(event) {
        return new AppEvent(this.getPointOnScreen(event));
    }

    mouseDown(event) {
        var e = this.getAppEvent(event);

        this.mouseIsDown = true;
        this.offset = e.p.subtract(l.centre);
    }

    mouseUp(event) {
        var e = this.getAppEvent(event);

        this.mouseIsDown = false;
    }

    mouseMove(event) {
        var e = this.getAppEvent(event);

        if (this.mouseIsDown) {
            l.centre = e.p.add(this.offset.times(-1));
        }
    }

    scroll(event) {
        var e = this.getAppEvent(event);

        var dy = - event.deltaY;
        var ds = zz;

        if (event.shiftKey) {
            ds = v(dy, 0);
        }
        else {
            ds = v(0, dy);
        }

        l.centre = l.centre.add(ds);
    }

    update(timeDelta) {
        super.update(timeDelta);

        this.elements.forEach(e => e.update(this.time, timeDelta));
    }

    draw() {
        this.graphics.clear(this.width, this.height, "rgba(16, 16, 16, 1)");

        this.elements.forEach(e => {
            e.draw(this.graphics);
        });
    }
}

var app = new App("previewcanvas");

class Length {
    constructor(magnitude, unit) {
        this.magnitude = magnitude;
        this.unit = unit;
    }

    toMM() {
        if (this.unit == "mm") {
            return this;
        }
        else if (this.unit == "cm") {
            return new Length(this.magnitude * 10, "mm");
        }
        else if (this.unit == "dm") {
            return new Length(this.magnitude * 100, "mm");
        }
        else if (this.unit == "in") {
            return new Length(this.magnitude * 25.4, "mm");
        }
    }

    toCM() {
        return new Length(this.toMM().magnitude / 10, "cm");
    }

    toIn() {
        return new Length(this.toMM().magnitude / 25.4, "in");
    }

    toUnit(unit = "mm") {
        if (unit == "mm") {
            return this.toMM();
        }
        else if (unit == "cm") {
            return this.toCM();
        }
        else if (unit == "in") {
            return this.toIn();
        }
    }

    toString() {
        return this.magnitude.toFixed(4) + " " + this.unit;
    }
}

var application = angular.module("CoverSizeCalculator", []);

application.controller("MainController", ["$scope", "$rootScope", function MainController($scope, $rootScope) {

    $scope.pageWidth = "17.6 cm";
    $scope.pageHeight = "25.0 cm"
    $scope.paperThickness = "0.002252 in"
    $scope.numberOfPages = 350;
    $scope.bleed = "0.125 in";
    $scope.showCoverCentres = true;

    $scope.outputUnits = "cm";

    $scope.getLength = function (text, d) {
        if (text === undefined || text === null) {
            return d;
        }

        var match = text.match(/\s*(\d+(\.\d+)?)\s*(mm|cm|dm|in)\s*/);

        if (match !== undefined && match !== null) {
            var magnitude = match[1];
            var unit = match[3];

            return new Length(parseFloat(magnitude), unit);
        }
        else {
            return d;
        }
    }

    $scope.updateOutput = function () {
        var pw = this.getLength($scope.pageWidth, new Length(176, "mm")).toMM();
        var ph = this.getLength($scope.pageHeight, new Length(250, "mm")).toMM();
        var pt = this.getLength($scope.paperThickness, new Length(0.002252, "in")).toMM();
        var b = this.getLength($scope.bleed, new Length(0.125, "in")).toMM();

        var totalWidth = new Length(b.magnitude * 2 + pw.magnitude * 2 + pt.magnitude * $scope.numberOfPages, "mm");
        var totalHeight = new Length(b.magnitude * 2 + ph.magnitude, "mm");
        var spineWidth = new Length(pt.magnitude * $scope.numberOfPages, "mm");
        var leftBleedEdge = new Length(b.magnitude, "mm");
        var rightBleedEdge = new Length(b.magnitude + pw.magnitude * 2 + pt.magnitude * $scope.numberOfPages, "mm");
        var topBleedEdge = new Length(b.magnitude, "mm");
        var bottomBleedEdge = new Length(b.magnitude + ph.magnitude, "mm");
        var leftSpineEdge = new Length(b.magnitude + pw.magnitude, "mm");
        var rightSpineEdge = new Length(b.magnitude * 2 + pw.magnitude + pt.magnitude * $scope.numberOfPages, "mm");
        var backCoverCentre = new Length(b.magnitude + pw.magnitude / 2, "mm");
        var frontCoverCentre = new Length(b.magnitude + pw.magnitude * 1.5 + pt.magnitude * $scope.numberOfPages, "mm");

        $scope.totalWidth = totalWidth.toUnit($scope.outputUnits).toString();
        $scope.totalHeight = totalHeight.toUnit($scope.outputUnits).toString();
        $scope.spineWidth = spineWidth.toUnit($scope.outputUnits).toString();
        $scope.leftBleedEdge = leftBleedEdge.toUnit($scope.outputUnits).toString();
        $scope.rightBleedEdge = rightBleedEdge.toUnit($scope.outputUnits).toString();
        $scope.topBleedEdge = topBleedEdge.toUnit($scope.outputUnits).toString();
        $scope.bottomBleedEdge = bottomBleedEdge.toUnit($scope.outputUnits).toString();
        $scope.leftSpineEdge = leftSpineEdge.toUnit($scope.outputUnits).toString();
        $scope.rightSpineEdge = rightSpineEdge.toUnit($scope.outputUnits).toString();
        $scope.backCoverCentre = backCoverCentre.toUnit($scope.outputUnits).toString();
        $scope.frontCoverCentre = frontCoverCentre.toUnit($scope.outputUnits).toString();
    }

    $scope.updateCanvas = function () {
        var pw = this.getLength($scope.pageWidth, new Length(176, "mm")).toMM();
        var ph = this.getLength($scope.pageHeight, new Length(250, "mm")).toMM();
        var pt = this.getLength($scope.paperThickness, new Length(0.002252, "in")).toMM();
        var b = this.getLength($scope.bleed, new Length(0.125, "in")).toMM();

        l.pageHeight = app.height * 0.5;

        var r2 = l.pageHeight / ph.magnitude;

        l.pageWidth = r2 * pw.magnitude;
        l.paperThickness = r2 * pt.magnitude;
        l.numberOfPages = $scope.numberOfPages;
        l.bleed = r2 * b.magnitude;
        l.showCoverCentres = $scope.showCoverCentres;
    }

    $scope.$watchGroup(["pageWidth", "pageHeight", "paperThickness", "numberOfPages", "bleed", "showCoverCentres", "outputUnits"], function (newValues, oldValues) {
        $scope.updateOutput();
        $scope.updateCanvas();
    });

    new ClipboardJS(".copybutton");
}]);
