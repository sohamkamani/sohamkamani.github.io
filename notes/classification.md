Classification is the fitting of predictive data into _qualitative_ responses. 

This is normally done by giving the output as a set of probabilities that a group of predictors indicates a particular response.

## Why can't we use linear regression for this?

If there are more than 2 possible outcomes for classification, then using them for linear regression would not be possible because there is no way we can represent 3 distinct un-related qualities as numbers in a sequence. For example if we wanted to classify the ethnicity of a person based on some indicators, we could make a linear regression, with the output as:

```
0 - Caucsian
1 - Asian
2 - African
```

But, there is nothing preventing us from switching the numbers assigned to the races, but doing this would completely change the coefficients that we can estimate using regression.

We _could_ use regression with only 2 possible outputs for classification, the output being a rough estimate of the probability of a sample belonging to one class over the other.

One problem with this is since we are using a _linear_ model, the probability may go beyond 1, and below 0, both of which are impossible values for probability.

## The logistic model

The logistic model uses the equation  (called the logistic equation):

```
p(X) = exp(BB0 + BB1*X)/(1 + exp(BB0 + BB1*X))
```

In this case p(X) would always be between 0 and 1. With some rearrangement of this equation, we get:

```
log(p(X)/(1 - p(x))) = BB0 + BB1*X
```

Here, `p(X)/(1 - p(x))` is known as the "odds" and the log of the odds is called the "logit".

`BB1` can therfore be explained as the unit increase in the logit for a unit increase in `X`

Just like we use least squares to maximize the accuracy of the linear regression model, we use "likeliness" to maximize accuracy of the logistic model:

```
l(BB0, BB1) = prod<i=(y=1)>(p(Xi)) * prod<i'=(y=0)>(1 - p(Xi'))
```

