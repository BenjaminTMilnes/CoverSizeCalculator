
function getHardcoverSpineWidth(numberOfPages, paperThickness = 0.002252, units = "in") {
    // No fixed value or formula has been given for the spine width of a hardcover book - I've had to work out this formula empirically.

    // The spine width increases linearly with a fixed offset - i.e., y = ax + b.

    var ammWhitePaper = 0.0572;
    var ammCreamPaper = 0.0635;
    var bmm = 4.8;

    var ainWhitePaper = ammWhitePaper / 25.4;
    var ainCreamPaper = ammCreamPaper / 25.4;
    var bin = bmm / 25.4;

    if (paperThickness == 0.0025) {
        if (units == "mm") {
            return ammCreamPaper * numberOfPages + bmm;
        }
        else {
            return ainCreamPaper * numberOfPages + bin;
        }
    }
    else {
        if (units == "mm") {
            return ammWhitePaper * numberOfPages + bmm;
        }
        else {
            return ainWhitePaper * numberOfPages + bin;
        }
    }
}

class CoverLayout {
    constructor() {

        this.pageWidth = 300;
        this.pageHeight = 500;
        this.paperThickness = 0.1;
        this.numberOfPages = 350;

        this.format = "papercover";

        this.margin = 10;
        this.spineMargin = 5;

        // The 'bleed' property is only for papercover books.

        this.bleed = 10;

        // The two properties below are for hardcover books.

        this.wrap = 30;
        this.hinge = 20;

        this.centre = v2(500, 500);

        this.showCoverCentres = true;
        this.showCoverThirds = true;
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
        var b = 50;
        var c1 = "hsla(220, 60%, 70%, 1)";
        var c2 = "hsla(300, 60%, 70%, 1)";
        var c3 = "hsla(350, 60%, 70%, 1)";
        var c4 = "hsla(20, 60%, 70%, 1)";

        var bleed = this.bleed;

        if (this.format == "hardcover") {
            bleed = this.wrap;
        }

        var e1 = this.centre.add(v2(-this.spineWidth / 2 - this.pageWidth - bleed, -this.pageHeight / 2 - bleed));
        var e2 = e1.add(v2(this.pageWidth * 2 + this.spineWidth + bleed * 2, 0));
        var e3 = e2.add(v2(0, this.pageHeight));
        var e4 = e1.add(v2(0, this.pageHeight));

        var e5 = e1.add(v2(this.pageWidth + bleed, 0));
        var e6 = e5.add(v2(this.spineWidth, 0));
        var e7 = e6.add(v2(0, this.pageHeight));
        var e8 = e5.add(v2(0, this.pageHeight));

        var e9 = e1.add(v2(bleed, bleed));
        var e10 = e2.add(v2(-bleed, bleed));
        var e11 = e3.add(v2(-bleed, -bleed));
        var e12 = e4.add(v2(bleed, -bleed));

        var e13 = e9.add(v2(this.pageWidth / 2));
        var e13a = e9.add(v2(this.pageWidth * 1 / 3));
        var e13b = e9.add(v2(this.pageWidth * 2 / 3));
        var e14 = e10.add(v2(- this.pageWidth / 2));
        var e14a = e10.add(v2(- this.pageWidth * 1 / 3));
        var e14b = e10.add(v2(- this.pageWidth * 2 / 3));

        var e15 = e2.add(v2(0, this.pageHeight / 2));

        graphics.drawPath([e1, e2, e3, e4, e1], "rgba(32, 32, 32, 1)", "black", 0);
        graphics.drawPath([e5, e6, e7, e8, e5], "rgba(48, 48, 48, 1)", "black", 0);

        this.drawVerticalGuide(graphics, e1.x, c1);
        this.drawVerticalGuide(graphics, e5.x, c1);
        this.drawVerticalGuide(graphics, e6.x, c1);
        this.drawVerticalGuide(graphics, e2.x, c1);

        this.drawHorizontalGuide(graphics, e1.y, c1);
        this.drawHorizontalGuide(graphics, e4.y, c1);

        if (bleed > 0) {
            this.drawVerticalGuide(graphics, e9.x, c2);
            this.drawVerticalGuide(graphics, e10.x, c2);
            this.drawHorizontalGuide(graphics, e9.y, c2);
            this.drawHorizontalGuide(graphics, e12.y, c2);
        }

        if (this.showCoverCentres) {
            this.drawVerticalGuide(graphics, e13.x, c3);
            this.drawVerticalGuide(graphics, e14.x, c3);
            this.drawHorizontalGuide(graphics, e15.y, c3);
        }

        if (this.showCoverThirds) {
            this.drawVerticalGuide(graphics, e13a.x, c4);
            this.drawVerticalGuide(graphics, e13b.x, c4);
            this.drawVerticalGuide(graphics, e14a.x, c4);
            this.drawVerticalGuide(graphics, e14b.x, c4);
        }

        this.drawMeasureLine(graphics, e1.add(v2(-b, 4)), e4.add(v2(-b, -4)), "Total Height");
        this.drawMeasureLine(graphics, e1.add(v2(4, -b * 2)), e2.add(v2(-4, -b * 2)), "Total Width");
        this.drawMeasureLine(graphics, e5.add(v2(4, -b)), e6.add(v2(-4, -b)), "Spine Width");

        graphics.drawText("Total Height".toUpperCase(), e1.add(v2(-b - 5, bleed + this.pageHeight / 2)), "bottomcentre", -90, "Arial", 10, "normal", "normal", c1);
        graphics.drawText("Total Width".toUpperCase(), e1.add(v2(bleed + this.pageWidth * 0.75, -2 * b - 5)), "bottomcentre", 0, "Arial", 10, "normal", "normal", c1);
        graphics.drawText("Spine Width".toUpperCase(), e1.add(v2(bleed + this.pageWidth + this.spineWidth / 2, -b - 10)), "bottomcentre", 0, "Arial", 10, "normal", "normal", c1);

        graphics.drawText("Front Cover", e14.add(v2(0, this.pageHeight / 2)), "middlecentre", 0, "Book Antiqua", 30, "normal", "normal", "#F0F0F0");
        graphics.drawText("Back Cover", e13.add(v2(0, this.pageHeight / 2)), "middlecentre", 0, "Book Antiqua", 30, "normal", "normal", "#F0F0F0");

        if (this.spineWidth > 20) {
            graphics.drawText("Spine".toUpperCase(), e5.add(v2(this.spineWidth / 2, this.pageHeight / 8)), "middlecentre", 90, "Book Antiqua", 15, "normal", "normal", "#F0F0F0");
        }

        graphics.drawText("Left Spine Edge".toUpperCase(), e5.add(v2(-5, this.pageHeight / 2)), "bottomcentre", -90, "Arial", 10, "normal", "normal", c1);
        graphics.drawText("Right Spine Edge".toUpperCase(), e6.add(v2(5, this.pageHeight / 2)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c1);

        if (bleed > 0) {
            graphics.drawText("Left Bleed Edge".toUpperCase(), e9.add(v2(5, -bleed + this.pageHeight / 2)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c2);
            graphics.drawText("Right Bleed Edge".toUpperCase(), e10.add(v2(-5, -bleed + this.pageHeight / 2)), "bottomcentre", -90, "Arial", 10, "normal", "normal", c2);
            graphics.drawText("Top Bleed Edge".toUpperCase(), e9.add(v2(this.pageWidth / 10, 5)), "topleft", 0, "Arial", 10, "normal", "normal", c2);
            graphics.drawText("Bottom Bleed Edge".toUpperCase(), e12.add(v2(this.pageWidth / 10, -5)), "bottomleft", 0, "Arial", 10, "normal", "normal", c2);
        }

        if (this.showCoverCentres) {
            graphics.drawText("Front Cover Centre".toUpperCase(), e14.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c3);
            graphics.drawText("Back Cover Centre".toUpperCase(), e13.add(v2(-5, this.pageHeight / 4)), "bottomcentre", -90, "Arial", 10, "normal", "normal", c3);
        }

        if (this.showCoverThirds) {
            graphics.drawText("Front Cover First Third".toUpperCase(), e14b.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c4);
            graphics.drawText("Front Cover Second Third".toUpperCase(), e14a.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c4);
            graphics.drawText("Back Cover First Third".toUpperCase(), e13a.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c4);
            graphics.drawText("Back Cover Second Third".toUpperCase(), e13b.add(v2(5, this.pageHeight / 4)), "bottomcentre", 90, "Arial", 10, "normal", "normal", c4);
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

        this.resolutionFactor = 4;

        this.elements = [];
    }

    initialise() {
        super.initialise();

        this.graphics = new GraphicsContext(this.context);

        l.centre = v2(this.width / 8, this.height / 8);

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

    static get zero() {
        return new Length(0, "mm");
    }

    static get z() {
        return Length.zero;
    }

    add(length) {
        var l1 = this.toMM();
        var l2 = length.toMM();

        var l3 = new Length(l1.magnitude + l2.magnitude, "mm");

        return l3.toUnit(l1.unit);
    }

    negate() {
        var l3 = new Length(-this.magnitude, this.unit);

        return l3;
    }

    subtract(length) {
        return this.add(length.negate());
    }

    times(scalar) {
        var l3 = new Length(this.magnitude * scalar, this.unit);

        return l3;
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

var presets = {
    "size1": ["5 in", "8 in"],
    "size2": ["5.25 in", "8 in"],
    "size3": ["5.5 in", "8.5 in"],
    "size4": ["6 in", "9 in"],
    "size5": ["7 in", "10 in"],
    "size6": ["7.5 in", "9.25 in"],
    "size7": ["8 in", "10 in"],
    "size8": ["8.25 in", "6 in"],
    "size9": ["8.25 in", "8.25 in"],
    "size10": ["8.5 in", "8.5 in"],
    "size11": ["8.5 in", "11 in"],
    "size12": ["12.85 cm", "19.84 cm"],
    "size13": ["15.6 cm", "23.39 cm"],
    "size14": ["16.99 cm", "24.41 cm"],
    "size15": ["18.9 cm", "24.61 cm"],
    "a4": ["21 cm", "29.7 cm"],
    "a5": ["14.8 cm", "21 cm"],
    "a6": ["10.5 cm", "14.8 cm"],
    "b5": ["17.6 cm", "25 cm"],
    "b6": ["12.5 cm", "17.6 cm"],
}

var application = angular.module("CoverSizeCalculator", []);

application.controller("MainController", ["$scope", "$rootScope", function MainController($scope, $rootScope) {

    $scope.pageWidth = "17.6 cm";
    $scope.pageHeight = "25.0 cm";
    $scope.paperThickness = "0.0025 in";
    $scope.numberOfPages = 350;

    $scope.format = "papercover";

    $scope.margin = "0.125 in";
    $scope.spineMargin = "1.59 mm";

    $scope.bleed = "0.125 in";

    $scope.wrap = "15 mm";
    $scope.hinge = "10 mm";

    $scope.showCoverCentres = true;
    $scope.showCoverThirds = true;

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
        var pageWidth = this.getLength($scope.pageWidth, new Length(176, "mm"));
        var pageHeight = this.getLength($scope.pageHeight, new Length(250, "mm"));
        var paperThickness = this.getLength($scope.paperThickness, new Length(0.002252, "in"));
        var numberOfPages = $scope.numberOfPages;

        var margin = this.getLength($scope.margin, new Length(0.125, "in"));
        var spineMargin = this.getLength($scope.spineMargin, new Length(1.59, "mm"));

        var bleed = this.getLength($scope.bleed, new Length(0.125, "in"));
        var wrap = this.getLength($scope.wrap, new Length(15, "mm"));

        // For some reason, the hinge adds about an extra 2mm to the width of each side of the cover for a hardcover book. I don't know why this is.

        var hinge = new Length(2, "mm");

        var z = Length.z;

        var spineWidth = paperThickness.times(numberOfPages);

        if ($scope.format == "hardcover") {
            spineWidth = new Length(getHardcoverSpineWidth(numberOfPages), "in");
        }

        var totalWidth = z.add(bleed.times(2)).add(pageWidth.times(2)).add(spineWidth);
        var totalHeight = z.add(bleed.times(2)).add(pageHeight);

        if ($scope.format == "hardcover") {
            totalWidth = z.add(wrap.times(2)).add(margin.times(2)).add(pageWidth.times(2)).add(hinge.times(2)).add(spineWidth);
            totalHeight = z.add(wrap.times(2)).add(margin.times(2)).add(pageHeight);
        }

        var leftBleedEdge = z.add(bleed);
        var rightBleedEdge = totalWidth.subtract(bleed);
        var topBleedEdge = z.add(bleed);
        var bottomBleedEdge = totalHeight.subtract(bleed);

        if ($scope.format == "hardcover") {
            leftBleedEdge = z.add(wrap);
            rightBleedEdge = totalWidth.subtract(wrap);
            topBleedEdge = z.add(wrap);
            bottomBleedEdge = totalHeight.subtract(wrap);
        }

        var leftSpineEdge = leftBleedEdge.add(pageWidth);
        var rightSpineEdge = leftSpineEdge.add(spineWidth);

        if ($scope.format == "hardcover") {
            leftSpineEdge = leftBleedEdge.add(margin).add(pageWidth).add(hinge);
            rightSpineEdge = leftSpineEdge.add(spineWidth);
        }

        var backCoverCentre = leftBleedEdge.add(pageWidth.times(0.5));
        var frontCoverCentre = rightBleedEdge.subtract(pageWidth.times(0.5));
        var verticalCentre = topBleedEdge.add(pageHeight.times(0.5));

        var backCoverFirstThird = leftBleedEdge.add(pageWidth.times(1 / 3));
        var backCoverSecondThird = leftBleedEdge.add(pageWidth.times(2 / 3));
        var frontCoverFirstThird = rightBleedEdge.subtract(pageWidth.times(2 / 3));
        var frontCoverSecondThird = rightBleedEdge.subtract(pageWidth.times(1 / 3));

        if ($scope.format == "hardcover") {
            backCoverCentre = leftBleedEdge.add(margin).add(pageWidth.times(0.5));
            frontCoverCentre = rightBleedEdge.subtract(margin).subtract(pageWidth.times(0.5));
            verticalCentre = topBleedEdge.add(margin).add(pageHeight.times(0.5));

            backCoverFirstThird = leftBleedEdge.add(margin).add(pageWidth.times(1 / 3));
            backCoverSecondThird = leftBleedEdge.add(margin).add(pageWidth.times(2 / 3));
            frontCoverFirstThird = rightBleedEdge.subtract(margin).subtract(pageWidth.times(2 / 3));
            frontCoverSecondThird = rightBleedEdge.subtract(margin).subtract(pageWidth.times(1 / 3));
        }



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
        $scope.verticalCentre = verticalCentre.toUnit($scope.outputUnits).toString();

        $scope.backCoverFirstThird = backCoverFirstThird.toUnit($scope.outputUnits).toString();
        $scope.backCoverSecondThird = backCoverSecondThird.toUnit($scope.outputUnits).toString();
        $scope.frontCoverFirstThird = frontCoverFirstThird.toUnit($scope.outputUnits).toString();
        $scope.frontCoverSecondThird = frontCoverSecondThird.toUnit($scope.outputUnits).toString();
    }

    $scope.updateCanvas = function () {
        var pw = this.getLength($scope.pageWidth, new Length(176, "mm")).toMM();
        var ph = this.getLength($scope.pageHeight, new Length(250, "mm")).toMM();
        var pt = this.getLength($scope.paperThickness, new Length(0.002252, "in")).toMM();

        var m = this.getLength($scope.margin, new Length(0.125, "in")).toMM();
        var sm = this.getLength($scope.spineMargin, new Length(1.59, "mm")).toMM();

        var b = this.getLength($scope.bleed, new Length(0.125, "in")).toMM();
        var w = this.getLength($scope.wrap, new Length(15, "mm")).toMM();

        var bw = b;

        if ($scope.format == "hardcover") {
            bw = w;
        }

        var sw = new Length(pt.magnitude * $scope.numberOfPages, "mm");

        if ($scope.format == "hardcover") {
            sw = new Length(getHardcoverSpineWidth($scope.numberOfPages), "in").toMM();
        }

        l.pageHeight = 600;

        var r2 = l.pageHeight / ph.magnitude;

        l.pageWidth = r2 * pw.magnitude;
        l.paperThickness = r2 * pt.magnitude;
        l.numberOfPages = $scope.numberOfPages;

        l.format = $scope.format;

        l.bleed = r2 * b.magnitude;
        l.wrap = r2 * w.magnitude;

        l.showCoverCentres = $scope.showCoverCentres;
        l.showCoverThirds = $scope.showCoverThirds;
    }

    $scope.$watchGroup(["pageWidth", "pageHeight", "paperThickness", "numberOfPages", "format", "bleed", "wrap", "showCoverCentres", "showCoverThirds", "outputUnits"], function (newValues, oldValues) {
        $scope.updateOutput();
        $scope.updateCanvas();
    });

    $scope.updateOutput();
    $scope.updateCanvas();

    $scope.$watchGroup(["preset"], function (newValues, oldValues) {
        var preset = presets[$scope.preset];

        $scope.pageWidth = $scope.getLength(preset[0]).toString();
        $scope.pageHeight = $scope.getLength(preset[1]).toString();
    });

    new ClipboardJS(".copybutton");
}]);
