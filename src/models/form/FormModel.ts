import {UserModel} from '../user/UserModel';
import {DynamicValue} from './DynamicValue';

type Type =
  | 'radio'
  | 'dateTime'
  | 'date'
  | 'select'
  | 'lookup'
  | 'number'
  | 'yesno'
  | 'user'
  | 'input';

export interface FormModel {
  id: number;
  name: string;
  label: string;
  labelEn?: string;
  type: Type;
  required: boolean;
  viewOnly: boolean;
  defaultValue: any;
  value?: DynamicValue[];
  multiSelect?: boolean;
  userData?: UserModel[];
}
