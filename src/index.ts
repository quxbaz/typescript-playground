console.log('*** TypeScript Sandbox ***')

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
  const value: unknown = sum([1, 2, 3])
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
}

// -----------------------------------------------------------------------------
// Function that can take a value or function.

{
  function identityOrCall <T>(value: T): T {
    if (typeof value === 'function')
      return value()  // Type 'T' is narrowed down to 'any'
    else
      return value
  }

  identityOrCall(42)
  identityOrCall(() => 'x')
}
