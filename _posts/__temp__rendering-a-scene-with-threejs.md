# Rendering a cube map in Three.js

[Three.js](http://threejs.org/) is an awesome library. It makes complicated things like 3d graphics and shaders to the average frontend developer, which opens up a lot of previously inaccessible avenues for web development. You can check out this [repository of examples](http://threejs.org/examples/) to see what's possible (basically, the skies the limit).

Even though Three.js provides all this funcitonality, it is one of the lesser documented libraries, and hence can be a little bit overwhelming for a new comer.
This tutorial will take you through the steps required to render a nice little scene with the Three.js library.

## Project structure and prerequisites

We would be using [npm](https://www.npmjs.com/) and [webpack](http://webpack.github.io/docs/) for making our application, along with ES6 syntax.

Initialize a new project in a new folder

```sh
npm init
```

After that, install three.js

```sh
npm install --save three
```

And were all set!


## Making a cubemap

A cubemap, if you haven't heard of it before, is precisely what its name suggests. Think of 6 enormous square pictures, all joined together to form a cube, with you being inside the cube. The 6 pictures then form a cubemap. It is used for making 3d background sceneries, and fillers.

Every rendering in 3d graphics has 2 elements, the scene, and the camera. The renderer then renders the scene *relative* to the camera. In this way, you can move through a scene by adjusting *its* camera, while at the same time stay still with respect to another scene because of its camera. This is the basic principle used while making movement based 3d graphics. You(or in this case, your camera) are standing still with respect to the background(or in some cases moving really slowly), considering it to be a near infinite distance from you. At the same time you will be moving with respect to the objects around you, since they are considered to be within your immediate distance.

1. First, we have to import our dependencies and initialize important objects. As mentioned before, each rendering will have a scene and a camera. Three.js provides constructors for both those things. The arguments we see for the camera are parameters like frustum vertical, aspect ratio, near frame, and far frame, which are much beyond the scope of this post. For almost all cases, these numbers can be consdered as defaults, and need not be changed.

    ```js
    import THREE from 'three';
    let sceneCube = new THREE.Scene();
    let cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    ```

2. Each cubemap is composed from 6 images. In the below snippet we are just making an array of paths, which is where all our images are kept. In this case, the image for one side of our cube (the positive x side) would be located at the path '/cubemap/cm_x_p.jpg'.

    ```js
    let path = '/cubemap/cm';
    let format = '.jpg';
    let urls = [
      path + '_x_p' + format, path + '_x_n' + format,
      path + '_y_p' + format, path + '_y_n' + format,
      path + '_z_p' + format, path + '_z_n' + format
    ];
    ```
  > But where do I find cubemap images from ?

  Normally, you would have to google for cubemap images, but those are not the best quality. You could make you own cubemap from a normal images and some respectable photoshop skills, or you could take images from some of the [examples](https://github.com/sohamkamani/three.js/tree/master/examples/textures/cube/SwedishRoyalCastle) that already exist.


3. This is the part where we actually "create" the cubemap from the images we have. Each scene is defined by a number of "meshes", and each mesh is defined by a geometry, which specifies the shape of the mesh, and a material, which specifies the appearence and colouring of the mesh. We now load the 6 images defined previously into a "texture cube", which is then used to define our material. The geometry we used is called a box geometry, and we are defining the length, width, and breath of this box to be a 100 units each.

    ```js
    let textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textureCube;

    let material = new THREE.ShaderMaterial({

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

      }),

    mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
    ```

4. Finally, our cubemap is added to the scene.

    ```js
    sceneCube.add(mesh);
    ```

Of course, we want to keep our code modular, so all the above code for making a cubemap should ideally be wrapped in its own function, and used in our main program as and when it is needed. The final cubemap "module" would look something like :

```js
'use strict';

import THREE from 'three';

let Cubemap = function () {
  let sceneCube = new THREE.Scene();
  let cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
  let path = '/cubemap/cm';
  let format = '.jpg';
  let urls = [
    path + '_x_p' + format, path + '_x_n' + format,
    path + '_y_p' + format, path + '_y_n' + format,
    path + '_z_p' + format, path + '_z_n' + format
  ];
  let textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
  let shader = THREE.ShaderLib.cube;
  shader.uniforms.tCube.value = textureCube;

  let material = new THREE.ShaderMaterial({

      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide

    }),

    mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
  sceneCube.add(mesh);

  return {
    scene : sceneCube,
    camera : cameraCube
  };
};

module.exports = Cubemap;
```

## Making our core module

Now, we would have to write the core of our little app to actually render the cubemap onto an element in the web browser.

1. Import dependencies to be used, and initialize our WebGL renderer :

    ```js
    'use strict';
    import THREE from 'three';
    import Cubemap from './Cubemap';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    let renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    ```
  The renderer return a `canvas` element which you can fix to your DOM. This canvas element is where all the magic happens. As usual, we are creating another scene and camera, different from the ones in our cubemap. All the objects that are not the cubemap be included in this scene.

2. Next, we add ambient light to our scene. This is so that we can actually *see* the other objects we add in the scene.

    ```js
    let lightAmbient = new THREE.AmbientLight(0x202020); // soft white light
    scene.add(lightAmbient);
    ```    

3. Define and start our rendering function :

    ```js
    let cubemap = Cubemap();
    let render = function () {
      requestAnimationFrame(render);
      renderer.render(cubemap.scene, cubemap.camera);
      renderer.render(scene, camera);
      cubemap.camera.rotation.copy(camera.rotation);
    };
    render();
    ```
  In case you are using movement (which is most often the case with WebGL), you will want to render your scene a number of times a second. The `requestAnimationFrame` function is a native browser function which calls the function you pass to it after a set time.

4. To really see your cubemapscene come alive, add a moving element as shown in the [Hello World](http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene) example from the Three.js website.


Three.js may seem overwhelming at first, but it's a huge improvement over the otherwise steep learning curve for [GLSL](https://www.opengl.org/documentation/glsl/). If you want to see a slightly more complex example of using cubemaps and objects in Three.js, you can take a look [here](http://threejs.org/examples/webgl_materials_cubemap_balls_refraction).
