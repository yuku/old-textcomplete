import Textcomplete from './textcomplete';
import Textarea from './textarea';

global.Textcomplete = Textcomplete;
global.Textcomplete.editors = {
  Textarea: Textarea,
};
