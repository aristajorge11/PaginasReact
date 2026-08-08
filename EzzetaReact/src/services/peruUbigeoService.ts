import ubigeoPeru from 'ubigeo-peru';

type UbigeoRecord = {
  departamento: string;
  provincia: string;
  distrito: string;
  nombre: string;
};

type UbigeoCatalog = {
  reniec: UbigeoRecord[];
};

const catalog = ubigeoPeru as unknown as UbigeoCatalog;
const ubigeoRecords = catalog.reniec;

const isDepartmentRow = (record: UbigeoRecord) => record.provincia === '00' && record.distrito === '00';
const isProvinceRow = (record: UbigeoRecord) => record.provincia !== '00' && record.distrito === '00';
const isDistrictRow = (record: UbigeoRecord) => record.distrito !== '00';

const normalize = (value: string) => value.trim().toLowerCase();

export type PeruUbigeoOption = {
  code: string;
  name: string;
};

export const getPeruDepartments = (): PeruUbigeoOption[] => {
  return ubigeoRecords
    .filter(isDepartmentRow)
    .map((record) => ({
      code: record.departamento,
      name: record.nombre,
    }));
};

export const getPeruProvinces = (departmentName: string): PeruUbigeoOption[] => {
  const department = getPeruDepartments().find(
    (option) => normalize(option.name) === normalize(departmentName),
  );

  if (!department) {
    return [];
  }

  return ubigeoRecords
    .filter((record) => isProvinceRow(record) && record.departamento === department.code)
    .map((record) => ({
      code: `${record.departamento}-${record.provincia}`,
      name: record.nombre,
    }));
};

export const getPeruDistricts = (departmentName: string, provinceName: string): PeruUbigeoOption[] => {
  const department = getPeruDepartments().find(
    (option) => normalize(option.name) === normalize(departmentName),
  );

  if (!department) {
    return [];
  }

  const province = ubigeoRecords.find(
    (record) => isProvinceRow(record)
      && record.departamento === department.code
      && normalize(record.nombre) === normalize(provinceName),
  );

  if (!province) {
    return [];
  }

  return ubigeoRecords
    .filter((record) => isDistrictRow(record)
      && record.departamento === department.code
      && record.provincia === province.provincia)
    .map((record) => ({
      code: `${record.departamento}-${record.provincia}-${record.distrito}`,
      name: record.nombre,
    }));
};
