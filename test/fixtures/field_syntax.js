class Field {
  fieldName
  fieldMethod = () => {}
}

class PrivateField {
  #privateFieldName
  #privateFieldMethod = () => {}
}

class ClassField {
  static classFieldName
  static #classPrivateFieldName
  static classFieldMethod = () => {}
  static #classPrivateFieldMethod = () => {}
}

class SameField {
  sameFieldName
  static sameFieldName
  static #sameFieldName
}
