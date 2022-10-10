'use strict'

function assertContainEntries (received, expected) {
  assertProgramObject(received, expected)
  assertClassObject(received.classes, expected.classes)
  assertNewerObject(received.newers, expected.newers)
  assertStaticMethodCallerObject(received.callers, expected.callers)
}

function assertProgramObject (received, expected) {
  expect(received.path).toEqual(expected.path)
  expect(received.main).toContainEntries(Object.entries(expected.main))
}

function assertClassObject (receivedClasses, expectedClasses) {
  expect(receivedClasses.length).toEqual(expectedClasses.length)

  receivedClasses.forEach((receivedClass, i) => {
    const expectedClass = expectedClasses[i]
    expect(receivedClass.name).toEqual(expectedClass.name)
    expect(receivedClass.isEmpty).toEqual(expectedClass.isEmpty)
    expect(receivedClass.superClass).toEqual(expectedClass.superClass)

    assertMethodObject(receivedClass.methods, expectedClass.methods)
    assertPropertyObject(receivedClass.properties, expectedClass.properties)
  })
}

function assertMethodObject (receivedMethods, expectedMethods) {
  expect(receivedMethods.length).toEqual(expectedMethods.length)

  receivedMethods.forEach((receivedMethod, i) => {
    const expectedMethod = expectedMethods[i]
    expect(receivedMethod.name).toEqual(expectedMethod.name)
    expect(receivedMethod.isStatic).toEqual(expectedMethod.isStatic)
    expect(receivedMethod.visibilityKeyword).toEqual(expectedMethod.visibilityKeyword)
    expect(receivedMethod.params).toEqual(expectedMethod.params)

    assertPrototypeMethodCalleeObject(receivedMethod.callees, expectedMethod.callees)
  })
}

function assertPrototypeMethodCalleeObject (receivedMethodCallees, expectedMethodCallees) {
  expect(receivedMethodCallees.length).toEqual(expectedMethodCallees.length)

  receivedMethodCallees.forEach((receivedMethodCallee, i) => {
    const expectedMethodCallee = expectedMethodCallees[i]
    expect(receivedMethodCallee).toContainEntries(Object.entries(expectedMethodCallee))
  })
}

function assertPropertyObject (receivedProperties, expectedProperties) {
  expect(receivedProperties.length).toEqual(expectedProperties.length)

  receivedProperties.forEach((receivedProperty, i) => {
    const expectedProperty = expectedProperties[i]
    expect(receivedProperty).toContainEntries(Object.entries(expectedProperty))
  })
}

function assertNewerObject (receivedNewers, expectedNewers) {
  expect(receivedNewers.length).toEqual(expectedNewers.length)

  receivedNewers.forEach((receivedNewer, i) => {
    const expectedNewer = expectedNewers[i]

    expect(receivedNewer.caller.name).toEqual(expectedNewer.caller.name)
    expect(receivedNewer.callee.name).toEqual(expectedNewer.callee.name)

    expect(receivedNewer.caller).toContainEntries(Object.entries(expectedNewer.caller))
    expect(receivedNewer.callee).toContainEntries(Object.entries(expectedNewer.callee))
  })
}

function assertStaticMethodCallerObject (receivedMethodCallers, expectedMethodCallers) {
  expect(receivedMethodCallers.length).toEqual(expectedMethodCallers.length)

  receivedMethodCallers.forEach((receivedMethodCaller, i) => {
    const expectedMethodCaller = expectedMethodCallers[i]

    expect(receivedMethodCaller.caller.name).toEqual(expectedMethodCaller.caller.name)
    expect(receivedMethodCaller.callee.name).toEqual(expectedMethodCaller.callee.name)

    expect(receivedMethodCaller.caller).toContainEntries(Object.entries(expectedMethodCaller.caller))
    expect(receivedMethodCaller.callee).toContainEntries(Object.entries(expectedMethodCaller.callee))
  })
}

module.exports = assertContainEntries
