Linear regression is one of the simplest tools used for statistical learning, and also one of the most fundamental.

Linear regression revolves around the concept of fitting a set of samples to a linear relationship.

This linear relationship follows the form :

```
Y = β0 + β1*X + E
```

Where `E` is the random error introduced (and not caused due to the model itse;f being wrong, which is what bias is). `E` causes random errors even if the relationship between X and Y is actually linear.

## Estimating β0 and β1

In order to estimate β1 and β0, we need to get familiar with a concept called __residual sum of squares__ (RSS). This is the sum of the square of the errors between each value of `Y`, and the value of `β0 + β1*X` (which is the predicted value of `Y`)

We can represent RSS as :

```
RSS = (y1 - β0 - β1*x1)^2 + (y2 - β0 - β1*x2)^2 + ... + (yi - β0 - β1*xi)^2 
```

In order to find out the best approximations of `β0` and `β1`, we need to find the minimum RSS. We can do this by taking the partial differential of RSS with respect to `β1` and `β2` and equating that to zero.

That is,

```
d(RSS)/d(β0) = 0

d(RSS)/d(β1) = 0
```

We will then get 2 equations for the values of `β0` and `β1`.

## Standard error of the mean of Y

There are two mean values which we are interested in. One, is the true mean value of Y, which is the mean value of all samples if there was no irreducible error (E) introduced. The other mean value is the _population mean_, which is the mean value which we estimate by averaging all the observed samples of Y.

Naturally, there will be some difference in the true mean and population mean of Y. This can be measured by observing the standard mean error of Y, which is given by the formula :

```
SD(Y) = SE(Y)^2 = SD(Y)^2/n
```

`SD(Y)` is the standard deviation of the samples of Y, and `n` is the number of samples provided. We can then observe that the greater the number of samples, the lesser the standard error of the mean, which means the closer the mean is to the actual mean.

Similarly, there are formulas for the standard error of the estimates of β0 and β1 (pg 66). 

These standard errors are directly proportional to the square of the __residual standard error__(RSE), which is given by :

```
RSE = sqrt(RSS / (n - 2))
``` 

>The reason that it's (n - 2) is because the RSS can only be calculated after estimating the regression line, in which, if there were 2 points, would just be a line joining those points and so would be zero.

The residual sum of squares is more of an absolute measure of the total sum of errors for a list of samples. The RSE, on the other hand, is more of a relative measure, since we're dividing by the total number of considered samples.


## Confidence intervals

THe most popularly used confidence interval is 95%, which means the probability of the true value lying within that interval is 95%. For β0, and β1, the interval is defined as :

```
β0 +- 2*SE(β0)
β1 +- 2*SE(β1)
```

### t statistic and p values

The __t statistic__ measures how accurate the correlation between X and Y are. It is given by :

```
t = β1/SE(β1)
```

To calculate the p value, we will have to make to hypotheses. The first one will hypothesize that there is no relation between X and Y, which  means that β1 is zero (We call this H0). The second hypothesis says that there _is_ a relationship between X and Y, which means that β1 != 0. (Since `Y = β0 + β1*X`, if β1 is zero, that means Y does not depend on X)

Now if we have more than ~30 data samples, the distribution of the t statistic is a normal probability distribution. If we consider H0, this normal distribution should be centered around 0. Now consider the t statistic we calculated using the formula above. What is the probability that we could get this value, _assuming that H0 was true_?

This probability (which is the probability of getting a larger absolute value than `|t|`) can be calculated by seeing the area under the normal distribution plot after the `t` value which we got in our calculations.

A small p value means that it is highly unlikely that we would have gotten the p value that we did purely by chance, which means that there _must_ be some relation between X and Y, and so we can reject the null hypothesis (H0).

### R^2 Statistic

The `RSE` shows us the lack of fit of the model to our actual data. This is still quite an absolute value and depends on the scale of Y that we are observing.

>If someone told you that the RSE of their model was 2.78, you wouldn't really be able to tell if that was good or bad. The R^2 statistic tells us the lack of fit _as a proportion_ of the variance of Y

```
R^2 = 1 - (RSS/TSS)
```

Where `TSS` is the total sum of squares:

```
TSS = sum((yi - y_mean)^2)
```

## Multiple linear regression

The linear regression that we talked about until now only took one predictor into consideration. If there was more than one predictor, we would use multiple linear regression. In this case, `Y` would be expressed as:

```
Y = β0 + β1*X1 + β2*X2 + ... + βp*Xp
```

Where `X1..Xp` are the _p_ predictors of Y.

In order to estimate `β0..βp` to minimize least squares, we would need to use complex matrix calculation and it should ideally be done programatically.

### F statistic

Similar to regression with one predictor, we would like to find out if there is any relationship between _at least_ one of the predictors, and the predicted value.

We used the t-statistic for this before and measured the probability that there actually was a relationship, and it was not by random chance. We could similarly calculate the t statistic and p value for each of the predictors and see if any of the predictors actually has a relationship with the predicted value.

The problem with this is that when we increase the number of predictors, and with many data points, there is a much higher chance that _at least some_ of the predictors actually will show a high p value for their individual t statistic, which would be caused just by chance.

The F statistic takes the number of predictors into consideration as well and is given by:

```
F = ((TSS - RSS)/p)/(RSS/(n - p - 1))
```

Here, our H0 is that : `β1 = β2 = ... = βp = 0`

The F statistic follows the F distribution. So, for any given F statistic we can calculate its corresponding p value, which we can then use to reject H0.

An F statistic closer to 1 indicates there is no relationship between the predictors and Y, while one which is greater than 1 suggests that there is.

### RSE for multiple variables

The R^2 statistic always increases by adding new variables since the the training data can be fit more accurately, even with a weak association of a predictor variable, and we calculate R^2 from the training data.

This happens because the RSS decreases. The RSE, however, need not decrease, since it's given by:

```
RSE = sqrt(RSS/(n - p - 1))
```

So if adding another variable leads to only a tiny increase in RSS (smaller than the increase because of adding 1 to p), then the RSE may increase.

## Qualitative predictors

These are predictors which have distinct values (male or female, ethnicity, species).

These variables can be included in regression by using binary variables.

### For variables with 2 choices

The predictor can be included in the equation as `β*X`, where β is the coefficient which we have to determine, and X=0 if the choice is the first one, and 1 if it's not.

### For variables with more than 2 choices

If there are `k` possible choices, we need `k - 1` variables to express their effect. For example, if there are 4 choices, we could express it as:

```
β1*X1 + β2*X2 + β3*X3
```

If it was choice 1, then X1, X2 and X3 are all 0.
for choice 2, X1=1, and X2=X3=0
and so on.

## Extensions of the linear model

There are many cases where you may want to use variables other than linear ones:

1. If two variables are dependent on each other, you can use `X1*X2`
2. Sometimes, the relationship may be between a non linear form of X, like `X^2`, `log(X)`, or `sqrt(X)`

## Common problems occurring in regression

1. If the response and predictor relations are non linear. This can be measure be looking at the plot of errors. The solution is to try with some of the extensions as mentioned above.
2. If the variance of the irreducible error term may itself vary. This may occur more commonly in time series, where the random error may persist for some time.
3. Correlation of error terms. May happen if outlier data if obtained from the same source.
4. High leverage points, which are outliers in the predictor values (in the X space). Can be computed using the leverage statistic. High leverage points may happen in 2 dimensions as well, which means they do not have any high leverage in a single dimension alone, but do have it, if we consider the other dimensions together.
5. Collinearity - if the predictors terms are related to each other. This can be measured by computing the variance inflation factor (VIF). The VIF is equal to `1/(1-R^2)`, where the `R^2` statistic is obtained from regressing the variable whose VIF is to be found, onto the remaining variables. A VIF close to 1 tells us that there is probably no collinearity, while a VIF much greater than 1 suggests that some collinearity exists.

## KNN regression

KNN regression is calculated by averaging the K nearest neighbors of the point in question.

```
f(X) = sum<p=1..K>(Yp)/K
```

The graph plotted by using KNN regression follows the points more closely, and does not take a linear form, like before. 

On average, KNN works well for datasets with low number of dimensions, since neighboring points are normally closer together and the average gives a good estimate of the value of `Y`. However, as the number of dimensions increase, points which are seemingly close together, may be far apart when considering all dimensions. We can then see a rise in the MSE of KNN regression as compared to linear regression.