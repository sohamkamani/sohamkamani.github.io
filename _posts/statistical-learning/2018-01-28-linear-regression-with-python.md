---
layout: post
title:  "Linear regression with Python 📈"
date:   2018-01-28 08:45:12
categories: python math machine_learning statistical_learning
comments: true
author: Soham Kamani
---

Linear regression is the process of fitting a linear equation to a set of sample data, in order to predict the output.

In order to do this, we assume that the input `X`, and the output `Y` have a linear relationship.

> `X` and `Y` may or may not have a linear relationship. We just want to find the _closest_ linear relationship between them, in order to explain the data that we observe.

We can get a better understanding of linear regression from the following chart:

![sample plot](/assets/images/posts/stat-learning/sample-reg-plot.png)

The line is the linear relationship that we _predicted_ based on the points which we observed.

>If you want to get a brief recap of the theory behind linear regression, you can see my notes [here](https://github.com/sohamkamani/sohamkamani.github.io/blob/master/notes/linear_regression.md)

In order to perform linear regression with python, we will need to:

1. Generate the sample data, and divide it into training and testing data.
2. Create a linear regression model
3. Fit our model using the training data
4. Test our model using the testing data

<!-- more -->

## Simple linear regression using "scikit learn"

In order to use scikit learn to perform linear regression, you will have to [install it first](http://scikit-learn.org/stable/install.html)

### Generating our data

Instead of using a popular sample dataset, let's generate our own data instead. 
This will help us understand the values of the sample data better than if we took a real life dataset, and will also help us judge the accuracy of our model better, as you will see in the later sections.

Let's assume there is only one predictor variable. In that case the linear relationship will be of the form:

$$y = \beta _0 + \beta _1x_1 + \epsilon$$

If we normalize our data, so that   $$ \beta _0=0 $$ , we will get the simplified form of the above equation:

$$y = \beta x + \epsilon$$

Here, $$\epsilon$$ is a random value that represents the irreducible error that occurs with each measurement of $$y$$

Lets write a function to generate this data for us:

```py
def generate_dataset_simple(beta, n, std_dev):
  # Generate x as an array of `n` samples which can take a value between 0 and 100
  x = np.zeros(np.random() * 100)
  # Generate the random error of n samples, with a random value from a normal distribution, with a standard
  # deviation provided in the function argument
  e = np.random.randn(n) * std_dev
  # Calculate `y` according to the equation discussed
  y = x * beta + e
```

We can then create the required number of samples, and then separate them into training and testing sets:

```py
x, y = generate_dataset_simple(10, 50, 100)

# Take the first 40 samples to train, and the last 10 to test
x_train = x[:-10]
y_train = y[:-10]

x_test = x[-10:]
y_test = y[-10:]
```

### Estimating the coefficient from the data

Now that we have our data, let's use scikit learn's `LinearRegression` model to predict the coefficients from the raw data using the ordinary least squares method of regression:

```py
# Import, and create an instance of a simple least squares regression model
from sklearn import linear_model
from sklearn.metrics import mean_squared_error, r2_score

model = linear_model.LinearRegression()

# Train the model using the training data that we created
model.fit(x_train, y_train)
# Now that we have trained the model, we can print the coefficient of x that it has predicted
print('Coefficient: \n', model.coef_)

# We then use the model to make predictions based on the test values of x
y_pred = model.predict(x_test)

# Now, we can calculate the models accuracy metrics based on what the actual value of y was
print("Mean squared error: %.2f"
      % mean_squared_error(y_test, y_pred))
print('r_2 statistic: %.2f' % r2_score(y_test, y_pred))
```

Running this on a sample set of data gave us:

```
Coefficients: [11.04668525]
Mean squared error: 6455.56
r_2 statistic: 0.95
```

We can see that the $$\beta$$ coefficient obtained from regression (`11.04668525`) is very close to the actual value that we used to generate our data.

We have also displayed the $$R^2$$ statistic, which indicates, on a scale of 0 to 1, how much of our data can be explained by our model. We can see that the score is close to 1, and so our model has done quite well in this regard.

### Plotting our results

To get a better sense of our data and predictions, we can use the "matplotlib" library for visualization:

```py
from matplotlib import pyplot as plt
plt.scatter(x_train, y_train)
plt.plot(x_test, y_pred, color='red')
x_actual = np.array([0, 100])
y_actual = x_actual*beta
plt.plot(x_actual, y_actual, color='green')
plt.show()
```

Which will give us the following plot:

![regression plot](/assets/images/posts/stat-learning/regression_plot.png)

The blue points show us the testing data that we generated. The red line is the predicted relationship between $$x$$ and $$y$$ as determined by linear regression. The green line is the _actual_ relationship, with the $$\beta$$ value that we used to generate the data.

## Working with multiple predictor variables

In the previous sections, we used just one predictor. Let's generate data with more than one predictor variable to estimate $$y$$. In this case, the relationship between $$X$$ and $$y$$ (ignoring the $$\beta _0$$ term) would be of the form:

$$y = \beta _1x_1 + \beta _2x_2 + ... + \beta _px_p + \epsilon$$

For this, we will have to make a new data generation function:

```py
def generate_dataset(coeffs, n, std_dev):
  # We calculate the number of predictors, and create a coefficient matrix
  # With `p` rows and 1 column, for matrix multiplication
  p = len(coeffs)
  coeff_mat = np.array(coeffs).reshape(p, 1)
  # Similar as before, but with `n` rows and `p` columns this time
  x = np.random.random_sample((n, p))* 100
  e = np.random.randn(n) * std_dev
  # Since x is a n*p matrix, and coefficients is a p*1 matrix
  # we can use matrix multiplication to get the value of y for each
  # set of values x1, x2 .. xp
  # We need to transpose it to get a 1*n array from a n*1 matrix to use in the regression model
  y = np.matmul(x, coeff_mat).transpose() + e
  return x, y
```

We can then generate our data:

```py
# We now have an array of coefficients, instead of a single one
x, y = generate_dataset_simple([10, 5], 50, 100)
```

The rest of the process is the same as the single predictor case. The only difference is that this time, there will be multiple predicted coefficients, which we can compare to the coefficients we chose.

In this case, since we have 2 predictor variables, we can generate some sample data and generate a 3d plot which plots $$x_1$$ and $$x_2$$ against $$y$$, along with independent 2d plots for each variable against $$y$$

```py
from mpl_toolkits.mplot3d import Axes3D
from generate_dataset import generate_dataset as gd
from matplotlib import pyplot as plt

predictor_coeffs =[1, 1]
std_dev = 10
n = 100

X, Y = gd(predictor_coeffs, n, std_dev)

f, [[p1, p2], [p3, p4]] = plt.subplots(2,2)

p1.scatter(X[:,0], Y)
p1.set_title("x1")

p2.scatter(X[:,1], Y)
p2.set_title("x2")

p3 = f.add_subplot(223, projection='3d')
p3.scatter(X[:,0], X[:,1], Y)
p3.set_title("x1, x2, y")

plt.show()
```

Which will give us:

![regression 3d plot](/assets/images/posts/stat-learning/regression_3d_plot.png)

An interesting observation is that when we plot each individual variable against $$y$$, it appears to have a lot of variance. However, when we visualize the _combined_ effects in the form of a 3d plot, we can see the the result actually forms a plane, which when viewed at a skewed angle (to see the edge of the plane formed), looks like it has a lot less variance.

This same concept applies for models with greater than 2 predictor variables, although we cannot visualize in more than 3 dimensions.

You can find the source code for all examples as well as the Jupyter notebook [here](https://github.com/sohamkamani/blog_example__linear_regression).

<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_SVG" type="text/javascript"></script>