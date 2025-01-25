#!/usr/bin/env osascript -l JavaScript

function run() {
   try {
       const app = Application('OmniFocus');
       const doc = app.defaultDocument();
       const projects = doc.projects();
       
       let output = '';
       for (let project of projects) {
           if (!project.completed()) {
               output += `${project.name()}`;
               
               if (project.dueDate()) {
                   output += ` @due(${project.dueDate().toISOString().split('T')[0]})`;
               }
               if (project.deferDate()) {
                   output += ` @defer(${project.deferDate().toISOString().split('T')[0]})`;
               }
               output += ':\n';
               
               const tasks = project.flattenedTasks();
               for (let task of tasks) {
                   if (!task.completed()) {
                       output += `    - ${task.name()}`;
                       
                       const tags = task.tags();
                       if (tags.length > 0) {
                           tags.forEach(tag => {
                               output += ` @${tag.name()}`;
                           });
                       }
                       
                       if (task.dueDate()) {
                           output += ` @due(${task.dueDate().toISOString().split('T')[0]})`;
                       }
                       if (task.deferDate()) {
                           output += ` @defer(${task.deferDate().toISOString().split('T')[0]})`;
                       }
                       
                       output += '\n';
                   }
               }
               output += '\n';
           }
       }
       
       return output;
   } catch (e) {
       return `Error: ${e.toString()}\n${e.stack}`;
   }
}

run();
