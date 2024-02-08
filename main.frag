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
    Real realComponent = Real(complex.realValue.value * complex.realValue.value - (complex.imaginaryValue.value * complex.imaginaryValue.value));
    Imaginary imaginaryComponent = Imaginary(complex.imaginaryValue.value * complex.realValue.value * 2.);
    return Complex(realComponent,imaginaryComponent);
}

Complex add(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value + b.imaginaryValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value + b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex subtract(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value - b.imaginaryValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value - b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

float complexLength(Complex complex){
    vec2 vec =  vec2(complex.realValue.value,complex.imaginaryValue.value);
    return length(vec);
}

vec3 mandelbrot(Complex complex){
    const int iterationLimit = 20;
    Complex prev;
    Complex difference;    
    float length;
    for (int i = 0; i < iterationLimit; i++){
        prev = complex;
        complex = add(squareComplex(complex), complex);
        difference = subtract(complex,difference);
        length = complexLength(difference);
        if(length > 100000000.){
            return vec3(1);
        }
    }
    return vec3(0);

}

vec3 graph(vec2 uv){
    Complex complex = Complex(Real(uv.x), Imaginary(uv.y));
    if (complex.realValue.value == 0.){
        return vec3(0);
    }
    if(complex.imaginaryValue.value == 0.){
        return vec3(0);
    }

    // return vec3(complex.realValue.value, complex.imaginaryValue.value,0);
    return mandelbrot(complex);
}

void main(){
    vec2 uv = vec2(2.0 * gl_FragCoord.xy / u_resolution - 1.);    
    float graphScale = 2.;
    vec2 zoomCoord = vec2(0.5,0);
    vec2 cameraPos = vec2(0);
    vec3 color = graph(vec2(graphScale*uv));
    // color = vec3(uv,0);
    gl_FragColor = vec4(color,1);
}