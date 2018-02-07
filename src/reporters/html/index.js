import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import memoryReporter from '../memory';

export default (baseReporter = memoryReporter) => {
    const reporter = baseReporter();
    const template = fs.readFileSync(path.resolve(__dirname, './base.html'), { encoding: 'utf-8' });
    const compiled = _.template(template);

    return {
        ...reporter,
        getHtml() {
            return compiled({
                _,
                events: reporter.getEvents(),
                hierarchy: reporter.getHierarchy(),
            });
        },
    };
};
