- *Y* is the output value (response), or the value we are trying to predict
- *P* refers to the number of predictors `(x1, x2, x3 ...)`. This can also be thought of as a vector with *P* dimensions.
- *n* refers to the number of samples.

- Each sample will have *P* predictors.
- To combine the sample number, and the vector number, we denote X as `x_ij`,  where `i` varies from 1..n, and `j` from 1..P

Our end goal is to estimate the relationship between the input variables and output value, which we can describe as a function (`f(X)`)

This function can be estimated using parametric methods or non-paramteric methods.

## Parametric methods

This method of estimation assumes what the form of `f(X)` is.

For example, we can assume f(X) is a linear equation of its predictors :

```
f(X) = c0 + c1*x1 + c2*x2 + ...
```

Our job then, is to fit the values of `c0..cP` using our input samples.

The advantage of this is that we do not require many samples to do this, and it is relatively easier than the next method.

The disadvantage is that if the actual relationship does not take the form of the function that we assumed, we can get a higher error rate.

## Non parametric methods

Here we do not assume the form of f(X) and use other methods to estimate it.

We get a more accurate result because we don't have to assume the form of f(X), however, many more samples are required to attain an acceptable form of accuracy.

## Flexible vs non-flexible models

Non-flexible approaches, like the one discussed in parametric methods, although they may seem much worse than non-restrictive models like spline fitting(a non parametric method), still have some advantages over the latter:

1. They are more interpretable. This means that if there is a result, or prediction, we can infer _why_ it happened from the model. For example, A model predicts that temperature is proportional to the latitude of the region (linear model fitted through regression), and predicts the temperature of a region, we will know exactly why it predited it.

2. The more flexible a method is, the more prone it is to overfitting. The greater flexibility sometimes follows errors and random readings and actually leads to _less accurate predictions_.

## Types of learning - supervised and un-supervised

In short, if we are given the responses for a set of predictors, and need to predict a response based on a new predictor, the problem is that of __supervised learning__. On the other hand, if we do not have the responses and simple want to somehow separate or distinguish between different samples based on predictor values, we have a case of __unsupervised learning__.

There is also a hybrid of the two, known as semi-supervised learning, where we have the responses available for some of the samples, but not all of them. THis is common in cases where it is cheap to obtain predictor measurements, but expensive to obtain response measurements.

## Calculating the accuracy of our model (Regression)

The entire point of all of these methods is to yield the most accurate result. In order to find out how accurate our method is, we need a quantitative measure of accuracy. We define this as the mean squared error(MSE), which can be written int he form of the equation :

```
MSE = sum<1..n>((y - f`(x_n))^2)
```

Where `y` is the response and `f`(x)` is the predicted response.

There are 2 types of MSE. The _training MSE_ is the MSE calculated using the training data. The _testing MSE_ is the MSE calculated using data that was not used to train the model.

In general, the more flexible our model is, the more our training MSE will go down. However, the testing MSE does not always go down with the degree of flexibility. This is caused because a model trained with too much flexibility can be over fitted, and random variations in the training data find their way into the model. If we plot the testing MSE with respect to the degree of freedom of the model, we will find an inflexion point with the least MSE, which is when we know we have arrived at the optimal degree of flexibility.

### Variance

Let's suppose we have `k` different training sets. We also have `x0` which is a testing data point.

For each different training data set, we train our model and test it on `x0`.

We can then obtain the variance of the different training sets with respect to `x0` by calculating how much `y'` (which is the estimated response given my a model) varies when we train our model with a different training dataset.

Variance increases by increasing flexibility since the model will always fit each set of training data points more closely.

### Bias

Bias refers to how much the form of the function we chose actually differs from the actual form of the function representing the response values.

Bias normally is greater when the flexibility is lesser. This is because in real life, there is rarely ever a perfectly linear relation between input and output variables. This means that the more flexibility we have, the closer we get to estimation the actual response.

### Relationship to MSE

The average MSE for the `x0` data point for different models obtained with different data sets, is the sum of the variance for `x0` over the `k` trained models, the squared bias and the irreducible error term (`Variance(E)`)

```
Avg MSE = Variance<1..k> + Bias<1..k>^2 + Variance(E)
```


## Calculating the accuracy of our model (Classification)

The accuracy of a classification models is captured using the error rate, which is the ratio of incorrectly classified samples to the total number of samples.

### Bayes classification and Bayes error rate

A classifier which classifies a sample based on where the porbability that it belongs to a class is largest is known as bayes classifier.

This is a conditional probability represented by `P(Y=j|x=x0)` where `j` is the correct class, and `x0` is the given predictor.

Since the classifier always classifies where the above probability is maximum, the error rate for this classifier is `1 - P_max_j(Y=j|x=x0)` (1 minus the  maximum probability of `Y` belonging to any class `j`)

The overall error rate is the average of the above error rate over all samples of `X`

The bayes classifier is considered the perfect classifier (similar to the actual function `f(x)` in regression), and the overall bays error rate is similar to the irreducible error term in regression.