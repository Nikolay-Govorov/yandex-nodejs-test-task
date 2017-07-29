# Yandex NodeJS test task

Тестовое задание, для поступления школу NodeJS от Яндекса

Описание задания [здесь](/description.txt)

Задание выполнено на ванильном JavaScript без зависимостей. Используются последние возможности ES6, CSS3 а так же Web Components, поэтому очень важно использовать для проверки **последний Chrome**.

## Сделанные допущения:

1. Во всех методах я подразумеваю, что вы святые и всегда выдаёте мне правильные данным. По этому я часто опускаю валидацию входящих параметров.

2. При валидацци ФИО я подразумеваю что "слово" это нечто состоящее из букв русского и английского алфавита. При боевой разработке правильнее сделать чёрный список симоволов и запретить их, на в данном случае это излишне.

3. При валидации email я следовал идеям примерно описанным в этой статье https://habrahabr.ru/post/175375/ Я с ней  большинстве своём согласен, поэтому в локальной части адреса запрещены только пробел и эти символы: \ / " ' : ; ( ) , Я запретил их потому что эти символы не разрешает встроенная браузерная валидация Chrome для элемента с типом email.
