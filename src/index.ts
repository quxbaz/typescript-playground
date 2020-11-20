console.log('*** TypeScript Sandbox ***')

// -----------------------------------------------------------------------------
// `never` type
// `never` is a type that should never occur.
{
  function throwError (): never {
    throw 'Error'
  }

  // const a: never = '' as any  // Compiler error.
}

// -----------------------------------------------------------------------------
// interface vs. type
{
  interface IdentityInterface { <T>(x: T): T }
  const identityA: IdentityInterface = (x) => x
  identityA(1)

  /*
    Not the same as above. The 'type' form needs to resolve the generic
    <T> parameter at the implementation stage. Whereas the 'interface'
    form resolves the generic <T> parameter when the function is called.

    Usually you will want to use the interface form.
  */
  type IdentityType<T> = (x: T) => T
  const identityB: IdentityType<number> = (x) => x
  identityB(1)
}

// -----------------------------------------------------------------------------
// Attempting to add 'Key' types.
{
  type Key = number | string

  const add = (x: number, y: string) => x + y

  /*
    TypeScript won't allow the addition of <number|string> union types so
    you have to use narrowing expressions to communicate to the compiler
    your intent.
  */
  const addKeys = (x: Key, y: Key): Key => {
    if (typeof x === 'number' && typeof y === 'number')
      return x + y
    else
      return x.toString() + y.toString()
  }
}

// -----------------------------------------------------------------------------
// Mapped object types
{
  const obj:{[key: string]: number} = {a: 1, b: 2, c: 3}
}

// -----------------------------------------------------------------------------
// Defining a function that can take any arguments.
{
  const anyArgs = (...args: unknown[]) => args[0]
  let arg = anyArgs(1) as number
  arg = arg * 2
}

// -----------------------------------------------------------------------------
// Defining a function with an optional argument.
{
  function optionalArg (x?: any) {
    return x
  }
}

// -----------------------------------------------------------------------------
// Playing with the 'unknown' type.
{
  const identity = <T>(value: T) => value
  const s: string = identity('string')
}
{
  const identity = (value: unknown) => value
  const s: string = identity('string') as string  // Need to narrow the return type to a string.
}

// -----------------------------------------------------------------------------
// Type guards
{
  const sum = (arr: number[]): number => arr.reduce((x, y) => x + y)
  const isNumber = (value: unknown): value is number => typeof value === 'number'
  const value: unknown = sum([1, 2, 3])  // `value` type is unknown even after execution.

  // This is the type guard. It narrows down the 'unknown' value to a number.
  if (isNumber(value)) {
    const newValue: number = value
  }
}

// -----------------------------------------------------------------------------
// Objects
{
  const returnObject = (): {} => ({a: 1, b: 2})

  function fn({path='default path'}) {
    return path
  }

  let obj1: {} = {}
  obj1 = {a: 1}
  obj1 = 1
  obj1 = true
  obj1 = false
  obj1 = 'string'
  obj1 = []
  obj1 = [1, 2, 3]
  obj1 = function () {}
  obj1 = new Date()
  obj1 = Symbol()
  // obj = null        // Error
  // obj = undefined   // Error

  let obj2: object = {}
  obj2 = {a: 1}
  obj2 = []
  obj2 = [1, 2, 3]
  obj2 = function () {}
  obj2 = new Date()
  // obj2 = 1          // Error
  // obj2 = true       // Error
  // obj2 = false      // Error
  // obj2 = 'string'   // Error
  // obj2 = Symbol()   // Error
  // obj2 = null       // Error
  // obj2 = undefined  // Error

}

// -----------------------------------------------------------------------------
// Function interface with generic type
{
  interface Component<Props={}> {
    (props: Props): {},
  }

  interface Props { text: string }

  const MyComponent: Component<Props> = function ({text='hello'}) {
    return {
      render () { return text }
    }
  }

  interface HasObjectParam {
    foo: string,
    bar: string,
    fn: <T>(arg: T) => any,
  }

  const h: HasObjectParam = {
    foo: 'foo',
    bar: 'bar',
    fn: (arg) => null
  }
}

// -----------------------------------------------------------------------------
// Function that can take a value or function.
{
  function identityOrCall <T>(value: T): T {
    if (typeof value === 'function')
      return value()  // Type 'T' is widened to 'any'
    else
      return value
  }

  identityOrCall(42)
  identityOrCall(() => 'x')
}

// -----------------------------------------------------------------------------
// Generators
{
  function* numberGenerator (n: number): Generator<number> {
    for (let i=0; i < n; i++)
      yield i
  }
  const generator = numberGenerator(10)
  while (true) {
    const {value, done} = generator.next()
    if (done)
      break
    // console.log(value)
  }
}

// -----------------------------------------------------------------------------
// Await, async
{
  async function fetchUser () {
    return new Promise(resolve => {
      setTimeout(() => resolve('Bob'), 1000)
    })
  }
  async function main () {
    const user = await fetchUser()
    console.log(user)
  }
  // main()
}

// -----------------------------------------------------------------------------
// ::TODO:: Attempting to re-create the wizardry that is the Parameters<T> type.
//
//

// -----------------------------------------------------------------------------
// `in`
{
  // Only `type` works here, not `interface`. Also, you cannot specify
  // additional properties on `User.`
  type User = {
    [K in 'id' | 'first' | 'last']?: string;
  }
  const main = function () {
    const user: User = {
      id: '0',
      first: 'Foo',
      last: 'Bar',
      // middle: 'Qux',  // `middle` not an allowed property of `User` type.
    }
  }
  main()
}

// -----------------------------------------------------------------------------
// `extends`
{
  interface User {
    name: string,
  }
  interface DBUser extends User {
    id: number,
  }
  const user: DBUser = {
    id: 0,
    name: 'Bob',
  }

  interface Func extends Function {}
  const fn: Func = function () {}
  // const a: Func = ''   // Error
  // const b: Func = {}   // Error
  // const c: Func = []   // Error
}

// -----------------------------------------------------------------------------
// Conditional types
{
  type NonNull<T> = T extends null | undefined ? never : T
  type Name = 'Foo' | 'Bar' | null | undefined
  type NonNullName = NonNull<Name>  // Type `Name` resolves to `'Foo' | 'Bar'`
  const foo: NonNullName = 'Foo'
  const bar: NonNullName = 'Bar'
  // const _null: NonNullName = null  // Error
  // const _undefined: NonNullName = undefined  // Error
}

// -----------------------------------------------------------------------------
// `infer`
{
  /*
    https://dev.to/aexol/typescript-tutorial-infer-keyword-2cn

    1. We check if type extends Promise.
    2. If it does we extract the type from the promise.
    3. If it does not leave it as is.
  */
  type Unpromisify<T> = T extends Promise<infer R> ? R : T

  /*
    https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types

    If `T` extends the function:

      (...args: any[]) => infer U`
                ^           ^
                |           | `infer` can infer the return type of the function.
                |
                | `any` can be assigned to any type, so this should fit any function type signature.

    ...Then return the type `U` which is the return type of `T`
    ...Else it means `T` does not extend the type `(...args: any[]) => U` and
    return the type `never`. This means type `T` is not a function.
  */
  type GetReturnType<T> = T extends (...args: any[]) => infer U ? U : never

  type Foo = GetReturnType<() => number>
  //   ^ = type Foo = number

  type Bar = GetReturnType<(x: string) => string>
  //   ^ = type Bar = string

  type Baz = GetReturnType<(a: boolean, b: boolean) => boolean[]>
  //   ^ = type Baz = boolean[]Try
}
