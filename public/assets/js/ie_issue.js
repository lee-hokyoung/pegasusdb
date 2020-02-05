// IE issue 오류 관련

// querySelectAll 으로 Element 를 선택했을 경우, Array 로 인식하지 못할 때
if (
  typeof NodeList !== "undefined" &&
  NodeList.prototype &&
  !NodeList.prototype.forEach
) {
  // Yes, there's really no need for `Object.defineProperty` here
  NodeList.prototype.forEach = Array.prototype.forEach;
}
// Create Element.remove() function if not exist
if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}
// Call remove() according to your need

// excel file Reader
if (FileReader.prototype.readAsBinaryString === undefined) {
  FileReader.prototype.readAsBinaryString = function(fileData) {
    var binary = "";
    var pt = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      var bytes = new Uint8Array(reader.result);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      //pt.result  - readonly so assign content to another property
      pt.content = binary;
      pt.onload(); // thanks to @Denis comment
    };
    reader.readAsArrayBuffer(fileData);
  };
}
