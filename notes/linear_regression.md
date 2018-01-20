Linear regression is one of the simplest tools used for statistical learning, and also one of the most fundamental.

Linear regression revolves around the concept of fitting a set of samples to a linear relationship.

This linear relationship follows the form :

```
Y = β0 + β1*X + E
```

Where `E` is the random error introduced (and not caused due to the model itse;f being wrong, which is what bias is). `E` causes random errors even if the relationship between X and Y is actually linear.

## Estimating β0 and β1

In order to estimate BB1 and BB0, we need to get familiar with a concept called __residual sum of squares__ (RSS). This is the sum of the square of the errors between each value of `Y`, and the value of `BB0 + BB1*X` (which is the predicted value of `Y`)

We can represent RSS as :

```
RSS = (y1 - BB0 - BB1*x1)^2 + (y2 - BB0 - BB1*x2)^2 + ... + (yi - BB0 - BB1*xi)^2 
```

In order to find out the best approximations of `BB0` and `BB1`, we need to find the minimum RSS. We can do this by taking the partial differential of RSS with respect to `BB1` and `BB2` and equating that to zero.

That is,

```
d(RSS)/d(BB0) = 0

d(RSS)/d(BB1) = 0
```

We will then get 2 equations for the values of `BB0` and `BB1`.

## Standard error of the mean of Y

There are two mean values which we are interested in. One, is the true mean value of Y, which is the mean value of all samples if there was no irreducible error (E) introduced. The other mean value is the _population mean_, which is the mean value which we estimate by averaging all the observed samples of Y.

Naturally, there will be some difference in the true mean and population mean of Y. This can be measured by observing the standard mean error of Y, which is given by the formula :

```
SD(Y) = SE(Y)^2 = SD(Y)^2/n
```

`SD(Y)` is the standard deviation of the samples of Y, and `n` is the number of samples provided. We can then observe that the greater the number of samples, the lesser the standard error of the mean, which means the closer the mean is to the actual mean.

Similarly, there are formulas for the standard error of the estimates of BB0 and BB1 (pg 66). 

These standard errors are directly proportional to the square of the __residual standard error__(RSE), which is given by :

```
RSE = sqrt(RSS / (n - 2))
``` 

>The reason that it's (n - 2) is because the RSS can only be calculated after estimating the regression line, in which, if there were 2 points, would just be a line joining those points and so would be zero.

The residual sum of squares is more of an absolute measure of the total sum of errors for a list of samples. The RSE, on the other hand, is more of a relative measure, since we're dividing by the total number of considered samples.


## Confidence intervals

THe most popularly used confidence interval is 95%, which means the probability of the true value lying within that interval is 95%. For BB0, and BB1, the interval is defined as :

```
BB0 +- 2*SE(BB0)
BB1 +- 2*SE(BB1)
```

### t statistic and p values

The __t statistic__ measures how accurate the correlation between X and Y are. It is given by :

```
t = BB1/SE(BB1)
```

To calculate the p value, we will have to make to hypotheses. The first one will hypothesize that there is no relation between X and Y, which  means that BB1 is zero (We call this H0). The second hypothesis says that there _is_ a relationship between X and Y, which means that BB1 != 0. (Since `Y = BB0 + BB1*X`, if BB1 is zero, that means Y does not depend on X)

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
