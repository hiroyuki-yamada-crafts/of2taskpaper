#!/usr/bin/env osascript -l JavaScript

function run() {
    try {
        const app = Application('OmniFocus');
        const doc = app.defaultDocument();

        function processFolder(folder, indent = '') {
            let output = '';
            if (folder.name() && folder.name() !== 'OmniFocus') {
                output += `${indent}${folder.name()}:\n`;
                indent += '    ';
            }

            // サブフォルダを処理
            folder.folders().forEach(subfolder => {
                output += processFolder(subfolder, indent);
            });

            // プロジェクトを処理
            folder.projects().forEach(project => {
                if (!project.completed()) {
                    output += `${indent}${project.name()}`;

                    if (project.dueDate()) {
                        output += ` @due(${project.dueDate().toISOString().split('T')[0]})`;
                    }
                    if (project.deferDate()) {
                        output += ` @defer(${project.deferDate().toISOString().split('T')[0]})`;
                    }
                    output += ':\n';

                    project.flattenedTasks().forEach(task => {
                        if (!task.completed()) {
                            output += `${indent}    - ${task.name()}`;

                            task.tags().forEach(tag => {
                                output += ` @${tag.name()}`;
                            });

                            if (task.dueDate()) {
                                output += ` @due(${task.dueDate().toISOString().split('T')[0]})`;
                            }
                            if (task.deferDate()) {
                                output += ` @defer(${task.deferDate().toISOString().split('T')[0]})`;
                            }
                            output += '\n';
                        }
                    });
                    output += '\n';
                }
            });

            return output;
        }

        return processFolder(doc);

    } catch (e) {
        return `Error: ${e.toString()}\n${e.stack}`;
    }
}

run();
