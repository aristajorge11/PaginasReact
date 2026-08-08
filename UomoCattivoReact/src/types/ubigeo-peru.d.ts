declare module 'ubigeo-peru' {
  const ubigeoPeru: {
    reniec: Array<{
      departamento: string;
      provincia: string;
      distrito: string;
      nombre: string;
    }>;
    inei: Array<{
      departamento: string;
      provincia: string;
      distrito: string;
      nombre: string;
    }>;
  };

  export default ubigeoPeru;
}