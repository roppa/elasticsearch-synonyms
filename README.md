# Synonyms are hard, lets face it

[![Build Status](https://travis-ci.org/roppa/elasticsearch-synonyms.svg?branch=master)](https://travis-ci.org/roppa/elasticsearch-synonyms)

Well, they aren't really, just check out a Thesaurus. However, the difficulty comes when we use phrases for synonyms. As Solr and Elasticsearch parse with a space ' ', phrases are broken up and our results are not what we expect. Like I say, synonyms are hard.

I'm also not worried about case at the moment, so RIRO, I expect your parameters to be the exact case you want.

The following is taken from elasticsearch [synonym tokenfilter](https://www.elastic.co/guide/en/elasticsearch/reference/2.3/analysis-synonym-tokenfilter.html) documentation:

```
# Blank lines and lines starting with pound are comments.

# Explicit mappings match any token sequence on the LHS of "=>"
# and replace with all alternatives on the RHS.  These types of mappings
# ignore the expand parameter in the schema.
# Examples:
i-pod, i pod => ipod,
sea biscuit, sea biscit => seabiscuit

# Equivalent synonyms may be separated with commas and give
# no explicit mapping.  In this case the mapping behavior will
# be taken from the expand parameter in the schema.  This allows
# the same synonym file to be used in different synonym handling strategies.
# Examples:
ipod, i-pod, i pod
foozball , foosball
universe , cosmos

# If expand==true, "ipod, i-pod, i pod" is equivalent
# to the explicit mapping:
ipod, i-pod, i pod => ipod, i-pod, i pod
# If expand==false, "ipod, i-pod, i pod" is equivalent
# to the explicit mapping:
ipod, i-pod, i pod => ipod

# Multiple synonym mapping entries are merged.
foo => foo bar
foo => baz
# is equivalent to
foo => foo bar, baz
```

There are four permutations of these synonyms:

  - Simple expansion (a,b,c)
  - Simple contraction (a,b,c => a)
  - Genre expansion (a => c,b,a)
  - Explicit mappings (a,b,c => a,b,c)

## Simple expansion

Simple expansion/Equivalent synonyms, are single words separated by a comma. Each term equals each other.

```
football,soccer,foosball
```

Searches for ```soccer``` would return ```foosball``` and ```football```.

Phrases would also be included in this if the lhs equaled the rhs of the fat arrow.

## Simple contraction

The key is in the term 'contraction' - words on the left are replaced by the term/s on the rhs.

```
leap,hop => jump
```

This has to be used at analysis time as well as query time. I think this is because at index time, terms on the left will be replaced with the term on the right, so in order for your search for "hop" to return results, you need to pass that in at the query time.

## Genre expansion

This sets up genres. For example, a cat is a type of pet. A kitten is a type of cat, which is a type of pet. A dog is a pet, and a puppy is a type of dog.

```
cat => cat,pet,
kitten => kitten,cat,pet,
dog => dog,pet,
puppy => puppy,dog,pet
```

Searching 'pet' would return 'cat', 'kitten', 'dog', 'puppy'.

## Explicit mapping

These match any token sequence on the LHS of "=>" and replace with all alternatives on the RHS. This has issues with phrases as elasticsearch tokenizes using whitespace. Terms on the left will be replaced by terms on the right.

```
a,b,c => a,b,c
```

## Install

```
const s = require('elasticsearch-synonyms');
```

## Methods

### s.expand(array)

Takes an array and returns a comma delimited string.

Turns:

```
['u s a', 'usa', 'united states of america']
```

into:

```
'u s a,usa,united states of america => u s a,usa,united states of america'
```

### s.expandString(string)

Takes a string of words separated with spaces and returns a comma delimited string, ```'wood bark tree splinter'``` becomes ```'wood,bark,tree,splinter'```.

### s.contract(array, [replacement])

The contract method should take an array and perform a simple contraction (a,b,c => a). If there is no replacement parameter (optional) it takes the first non-phrase and uses that for the replacement. For example:

```
['a', 'b b', 'c', 'd']
```

```
'a,c,d,b b => a'
```

If all phrases are used, each phrase is expanded:

```
['a a', 'b b', 'c c', 'd d']
```

```
'a a,b b,c c,d d => a a,b b,c c,d d'
```

### s.genre(object)

The genre method should take a hierarchy object and perform genre expansion (a => a,b,c).

Given the following object:

```
{
  pet: {
    cat: {
      kitten: 'kitten',
    },
    dog: {
      puppy: 'puppy',
    }
  }
}
```
Result will be:

```
cat => cat,pet
kitten => kitten,cat,pet
dog => dog,pet
puppy => puppy,dog,pet
```

There must be only one common ancestor. Each subsequent element starts off lhs, then fat arrow, then itself and predecessors.

### s.explicit(array, [array])

If a single array, comma delimits lhs and duplicates on rhs:

```
s.explicit(['g b', 'gb', 'great britain']);
> g b,gb,great britain => g b,gb,great britain
```

If two arrays, second array becomes the rhs:

```
s.explicit(['g b', 'gb', 'great britain'], ['britain', 'england', 'scotland', 'wales']);
g b,gb,great britain => britain,england,scotland,wales
```

### s.stringify(array or object)

Takes an array or object and stringifies it. With an object, a new line is inserted after each attribute (just the top level values are flattened):

```
{
  a: ['a', 'b'],
  c: ['c', 'd'],
}
```

```
'a,b\nc,d'
```

### s.stringToArray(string)

Takes a string and splits on new line character. Any comments (#) are removed. Used as the starting point for config file processing.

### s.parseFile(string)

Takes a config file (as a string), like the example token filter file in the introduction, and converts it to an object (tokens are expanded by default):

```
{
  'i-pod': ['ipod', 'i-pod', 'i pod'],
  'i pod': ['ipod', 'i-pod', 'i pod'],
  ipod: ['ipod', 'i-pod', 'i pod'],
  'sea biscuit': ['seabiscuit'],
  'sea biscit': ['seabiscuit'],
  foozball: ['foozball', 'foosball'],
  foosball: ['foozball', 'foosball'],
  universe: ['universe', 'cosmos'],
  cosmos: ['universe', 'cosmos'],
  foo: ['foo bar', 'baz']
}
```

## Testing

Run ```npm run test```

## References

  - Elasticsearch [synonyms, expand or contract](https://www.elastic.co/guide/en/elasticsearch/guide/current/synonyms-expand-or-contract.html)
  - Elasticsearch [synonym formats](https://www.elastic.co/guide/en/elasticsearch/guide/current/synonym-formats.html)
  - [Node solr synonyms](https://github.com/Prinzhorn/node-solr-synonyms)
