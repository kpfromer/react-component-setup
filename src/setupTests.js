import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import {createSerializer} from 'enzyme-to-json';
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));