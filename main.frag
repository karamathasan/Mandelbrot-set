precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

struct Real{
    float value;
};

struct Imaginary{
    float value;
};

struct Complex{
    Real realValue;
    Imaginary imaginaryValue;
};

Complex squareComplex(Complex complex){
    float biSquared = complex.imaginaryValue.value * complex.imaginaryValue.value;
    
    Real realComponent = Real(complex.realValue.value * complex.realValue.value - biSquared);
    Imaginary imaginaryComponent = Imaginary(complex.imaginaryValue.value * complex.realValue.value * 2.);
    // return Complex(Real(biSquared),imaginaryComponent);
    return Complex(realComponent,imaginaryComponent);
}

Complex add(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value + b.realValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value + b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex subtract(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value - b.imaginaryValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value - b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

float complexLength(Complex complex){
    vec2 vec =  vec2(abs(complex.realValue.value),abs(complex.imaginaryValue.value));
    return length(vec);
}

vec3 mandelbrot(Complex c){
    const float iterationLimit = 30.0;
    Complex z = Complex(Real(0.),Imaginary(0.));   
    // z=c; 
    Complex difference;
    Complex prev;
    float length;
    for (float i = 0.0; i < iterationLimit; i++){
        prev = z;
        z = add(squareComplex(z), c);
        difference = subtract(z,prev);
        length = complexLength(difference);

        if(length > 100.){
            return vec3( (iterationLimit-i)/iterationLimit) ;
        }
    }

    return vec3(0);

}

vec3 graph(vec2 camera){
    Complex complex = Complex(Real(camera.x), Imaginary(camera.y));
    // if (complex.realValue.value < 0.01 && complex.realValue.value > -0.01){
    //     return vec3(0.1647, 0.1647, 0.4275);
    // }
    // if(complex.imaginaryValue.value < 0.01 && complex.imaginaryValue.value > -0.01){
    //     return vec3(0.1647, 0.1647, 0.4275);
    // }

    if(complexLength(complex) < 0.01){
        return vec3(1,1,0);
    }

    // if (mod(abs(complex.realValue.value),0.5) < 0.5 && mod(abs(complex.realValue.value),0.5) > 0.475 ){
    //     if(complex.imaginaryValue.value < 0.1 && complex.imaginaryValue.value > -0.1){
    //         return vec3(0.1647, 0.1647, 0.4275);
    //     }
    // }

    // if (mod(abs(complex.imaginaryValue.value),0.5) < 0.5 && mod(abs(complex.imaginaryValue.value),0.5) > 0.475 ){
    //     if(complex.realValue.value < 0.1 && complex.realValue.value > -0.1){
    //         return vec3(0.1647, 0.1647, 0.4275);
    //     }
    // }
    return mandelbrot(complex);
}

void main(){
    vec2 uv = vec2(2.0 * gl_FragCoord.xy / u_resolution - 1.);    
    float graphScale = 1.5 - 0.05 * u_time;
    vec2 zoomCoord = vec2(0.5,0);
    vec2 cameraPos = vec2(graphScale*(uv + vec2(-0.5 + 0.05 * -u_time, 0.02 *-u_time)));
    vec3 color = graph(cameraPos); 

    // color = vec3(uv,0);
    gl_FragColor = vec4(color,1);
}