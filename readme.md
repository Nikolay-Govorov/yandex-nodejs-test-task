# Yandex NodeJS test task

Тестовое задание, для поступления школу NodeJS от Яндекса

Описание задания [здесь](/description.txt)

Задание выполнено на ванильном JavaScript без зависимостей.
Используются последние возможности ES6, CSS3 а так же Web Components
(я хотел использовать, но в ТЗ сказано писать всю логику в index.html,
поэтому от Web Components я отказался), поэтому очень важно использовать
для проверки **последний Chrome**.

Я описал минимальные стили, что бы это прилично смотрелось.

## Тестирование

Проект достаточно мал, поэтому тестирование - наивное, ручное. Мне не хотелось
усложнять, поэтому я не стал поднимать окружение для тестирования и писать авотматические тесты.

## Зависимости (которых нет)

Для проверки и работы приложения, зависимостей нет.
В корне проекта есть файл package.json в котором есть зависимости
разработки. Единственное без чего я не смог обойтись - линтеры.
Если вы желаете запустить их, то можете установить зависимости,
но это сугубо добровольно и абсолютно не нужно для работы.

## Сделанные допущения:

1. Во всех методах я подразумеваю, что вы святые и всегда выдаёте мне правильные данные. По этому я часто опускаю валидацию входящих параметров.

2. При валидацци ФИО я подразумеваю что "слово" это нечто состоящее из букв русского и английского алфавита. При боевой разработке правильнее сделать чёрный список симоволов и запретить их, на в данном случае это излишне.

3. При валидации email я следовал идеям примерно описанным в этой статье https://habrahabr.ru/post/175375/ Я с ней  большинстве своём согласен, поэтому в локальной части адреса запрещены только пробел и эти символы: \ / " ' : ; ( ) , Я запретил их потому что эти символы не разрешает встроенная браузерная валидация Chrome для элемента с типом email.

4. Для простоты тестирования, при отправке запроса я просто выбираю случайный статус из делаю запрос на файл который эмулирует ответ от сервера. Подставные ответы лежат в папке "fake-api". **ВАЖНО!** Даже при таком подходе, запрос на другой файл будет восприниматься как кроссдоменный, а значит не возможен по протокоду "file". Иными словами для работы нужен хотя бы **статический сервер**.

5. При стилизации я позволил себе стилизовать напрямую теги, так как уверен что проект не вырастет и разметки не добавится, а отступать от ТЗ не хочется. Ведь там ничего не сказано о дополнительных классах. В реальной жизни я конечно же так не делаю и исповедую БЭМ. Правда-правда.
