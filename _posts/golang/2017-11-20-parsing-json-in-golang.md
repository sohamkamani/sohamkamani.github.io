---
layout: post
title: Parsing JSON in Golang ⏩
date: 2017-10-18T01:45:12.000Z
categories: go golang json
description: "The many different ways to parse JSON in Go"
comments: true
---

There's always a bit of friction when it comes to making JSON work with statically types programming language. One one hand, JSON data can be anything from a simple number, to a complex array of embedded objects. Working with a language like Go means you have to make the variable structure of JSON fit into structured variables.

Fortunately, Go tries to make this process as easy for us as possible, and gives us many options to work with when we want to parse our JSON data.
<!-- more -->

- [In a nutshell](#in-a-nutshell)
- [Structured data](#structured-data)
    - [JSON Arrays](#json-arrays)
    - [Embedded objects](#embedded-objects)
    - [Custom attribute names](#custom-attribute-names)
- [Unstructured data](#unstructured-data)
- [What to use](#what-to-use)

## In a nutshell

The json package provided in Go's standard library provides us with all the functionality we need. For any JSON string, the standard way to parse it is:

```go
import "encoding/json"
//...

// ... 
myJsonString := `{"some":"json"}`

// `&myStoredVariable` is the address of the variable we want to store our
// parsed data in
json.Unmarshall([]byte(myJsonString), &myStoredVariable)
//...
```

What we will discuss in this post, is the different options you have for the type of `myStoredVariable`, and when you should use them.

There are two types of data you will encounter when working with JSON:

1. Structured data
2. Unstructured data

## Structured data

Since this is much easier, let's deal with it first. This is the sort of data where you know the structure beforehand. For example, let's say you have a bird object, where each bird has a `species` field and a `description` field :

```js
{
  "species": "pigeon",
  "decription": "likes to perch on rocks"
}
```

To work with this kind of data, create a `struct` that mirrors the data you want to parse. In our case, we will create a bird struct which has a `Species` and `Description` attribute:

```go
type Bird struct {
  Species string
  Description string
}
```

And unmarshal it as follows:

```go
birdJson := `{"species": "pigeon","description": "likes to perch on rocks"}`
var bird Bird	
json.Unmarshal([]byte(birdJson), &bird)
fmt.Printf("Species: %s, Description: %s", bird.Species, bird.Description)
//Species: pigeon, Description: likes to perch on rocks
```

[Try it here](https://play.golang.org/p/DtA6sEppLO)

>By convention, Go uses the same title cased attribute names as are present in the case insensitive JSON properties. So the `Species` attribute in our `Bird` struct will map to the `species`, or `Species` or `sPeCiEs` JSON property.

### JSON Arrays

So what happens when you have an array of birds?

```js
[
  {
    "species": "pigeon",
    "decription": "likes to perch on rocks"
  },
  {
    "species":"eagle",
    "description":"bird of prey"
  }
]
```

Since each element of the array is actually a `Bird`, you can actually unmarshal this, by just creating an array of birds :

```go
birdJson := `[{"species":"pigeon","decription":"likes to perch on rocks"},{"species":"eagle","description":"bird of prey"}]`
var birds []Bird
json.Unmarshal([]byte(birdJson), &birds)
fmt.Printf("Birds : %+v", birds)
//Birds : [{Species:pigeon Description:} {Species:eagle Description:bird of prey}]
```

[Try it here](https://play.golang.org/p/thoUdxxmMa)

### Embedded objects

Now, consider the case when you have a property called `Dimensions`, that measures the `Height` and `Length` of the bird in question:

```js
{
  "species": "pigeon",
  "decription": "likes to perch on rocks"
  "dimensions": {
    "height": 24,
    "width": 10
  }
}
```

As with our previous examples, we need to mirror the structure of the object in question in our Go code. To add an embedded `dimensions` object, lets create a `dimensions` struct :

```go
type Dimensions struct {
  Height int
  Width int
}
```

Now, the `Bird` struct will include a `Dimensions` field:

```go
type Bird struct {
  Species string
  Description string
  Dimensions Dimensions
}
```

And can be unmarshaled using the same method as before:

```go
birdJson := `{"species":"pigeon","description":"likes to perch on rocks", "dimensions":{"height":24,"width":10}}`
var birds Bird
json.Unmarshal([]byte(birdJson), &birds)
fmt.Printf(bird)
// {pigeon likes to perch on rocks {24 10}}
```

[Try it here](https://play.golang.org/p/zOUMUNH4w9)

### Custom attribute names

I mentioned earlier that Go uses convention to ascertain the attribute name it should map a property to. Many times though, you want a different attribute name than the one provided in your JSON data.

```js
{
  "birdType": "pigeon",
  "what it does": "likes to perch on rocks"
}
```

In the JSON data above, I would prefer `birdType` to remain as the `Species` attribute in my Go code. It is also not possible for me to provide a suitable attribute name for a key like `"what it does"`.

To solve this, we make use of struct field tags:

```go
type Bird struct {
  Species string `json:"birdType"`
  Description string `json:"what it does"`
}
```

Now, we can explicitly tell our code which JSON property to map to which attribute.

```go
birdJson := `{"birdType": "pigeon","what it does": "likes to perch on rocks"}`
var bird Bird
json.Unmarshal([]byte(birdJson), &bird)
fmt.Println(bird)
// {pigeon likes to perch on rocks}
```

[Try it here](https://play.golang.org/p/-_0XddCakR)

## Unstructured data

If you have data whose structure or property names you are not certain of, you cannot use structs to unmarshal your data. Instead you can use maps. Consider some JSON of the form:

```js
{
  "birds": {
    "pigeon":"likes to perch on rocks",
    "eagle":"bird of prey"
  },
  "animals": "none"
}
```

There is no struct we can build to represent the above data for all cases since the keys corresponding to the birds can change, which will change the structure.

To deal with this case we create a map of strings to empty interfaces:

```go
birdJson := `{"birds":{"pigeon":"likes to perch on rocks","eagle":"bird of prey"},"animals":"none"}`
var result map[string]interface{}
json.Unmarshal([]byte(birdJson), &result)

// The object stored in the "birds" key is also stored as 
// a map[string]interface{} type, and its type is asserted from
// the interface{} type
birds := result["birds"].(map[string]interface{})

for key, value := range birds {
  // Each value is an interface{} type, that is type asserted as a string
  fmt.Println(key, value.(string))
}
```

[Try it here](https://play.golang.org/p/xbVxASrffo)

Each string corresponds to a JSON property, and its mapped `interface{}` type corresponds to the value, which can be of any type. The type is asserted from this `interface{}` type as is needed in the code. These maps can be iterated over, so a variable number of keys can be handled by a simple for loop.

## What to use

As a general rule of thumb, if you _can_ use structs to represent your JSON data, you should use them. The only good reason to use maps would be if it were not possible to use structs due to the uncertain nature of the keys or values in the data.