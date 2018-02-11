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

We introduce `p(X)`, or `P(Y=k|X=x)`

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

### Multiple predictor variables

This is very similar to the single predictor model, with the equation:

```
log(p(X)/(1 - p(x))) = BB0 + BB1*X1 + BB2*X2 + ... + BBp*Xp
```

### Multiple classes

Although logistic regression is possible for multiple output classes (greater than 2), similar to the process of assigning distinct valued variables in linear regression, LDA is preferred to this method.

## Linear discriminant analysis (LDA)

LDA uses Bayes theorem to classify a sample based on its predictors.

We introduce `P(X=x|Y=k)`, or `f_k(x)`. Which is the probability that X would be the value `x` _given_ the result Y belonged to the class `k`

Then, according to bayes theorem:

```
p(X) = P_k(Y)*f_k(X)/sum<i=1..K>(P_i(Y)*f_i(X))
```

Now, our job is to find out for which class `k`, is p(X) maxmimum, and choose that, which is also known as bayes classifier.

The denominator term is constant, so we can ignore that for finding the maxmium.

`P_k(Y)`, which is the probability that a random sample belongs to class `k` is easy to find, which is the number of samples belonging to `k` divided by total samples `n`.

The only thing thats left is finding `f_k(X)`, for every class `k`.

To do this, we assume that f_k(X) takes a gaussian distribution:

```
f_k(X) = 1/(sqrt(2*pi)*sigma)exp(-(x - mean)^2/2*sigma^2)
```

Where sigma^2, and mean are the variance and mean of class `k` for X.

There are equations to estimate mean and sigma^2 from the samples.

The equations are similar for *multiple predictors*, with `X` and `mean` being replaced by a `p` length vector, and `sigma^2` by a p*p size covariance matrix.

Now, suppose we have 2 predictors(X1, X2), and 3 classes, we can plug in different values of X1 and X2 to get the probabilities (p_1(X), p_2(X), p_3(X)) of the sample belonging to each class. If we plot this on a chart, with X1 as the x axis and X2 as the y axis, we can get 3 different areas, where p_1(X) is the highest of the 3, p_2(X) is the highest of the three and p_3(X) is the highest of the three. The boundaries between these regions are bayes decision boundaries.

Using bayes classifier of always picking the highest probaility will always give us the least amount of total errors. But sometimes, this may not be what we want. 

For example, the there are 9000 people who have a disease, and 100 people who don't. We want to classify these 9100 people based on their symptoms. 

Of 9000 people without disease, 8930 were correctly diagnosed, with 70 false positives

Of 100 people with disease, 30 people were correctly diagnosed, with 70 false positives.

Total errors: 70 + 70 = 140, which seems quite less compared to the total of 9100, but horrible, when you consider that out of 100 people with the disease, 70, or 70% of them were given a false negative.

To fix this, we can change the threshold for bayes classifier. In the earlier case, if P(has_disease) > 0.5, then it was classified as a disease. We could reduce the threshold to, say, 0.3, which would give a greate total number of errors, but reduce the proportion of false negatives, to true negatives. If we increased it to 0.6, then again the total errors would increase, but the proportion of false positives to true positives would reduce.