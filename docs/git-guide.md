### Git гайд для проекта frontkaz

Этот документ описывает единый процесс работы с Git для проекта казино-аналитики (Next.js). Следуя ему, мы сохраняем чистую историю и предсказуемые релизы.

---

#### 1) Первичная настройка

- Установите имя и email (один раз глобально):

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"
```

- Рекомендованная настройка отображения и автоматического ребейза pull:

```bash
git config --global pull.rebase true
git config --global rebase.autoStash true
git config --global init.defaultBranch master
```

---

#### 2) Ветки и стратегия

- Базовая ветка: `master` (production-ready)
- Типы веток:
  - feature: `feature/<kebab-name>` — новая функциональность
  - fix: `fix/<kebab-name>` — багфиксы
  - docs: `docs/<kebab-name>` — только документация
  - chore: `chore/<kebab-name>` — рутинные изменения, конфигурация
  - hotfix: `hotfix/<kebab-name>` — срочные правки в продакшене

Создание ветки от актуального master:

```bash
git checkout master
git pull
git switch -c feature/add-ggr-ngr
```

---

#### 3) Коммиты (Conventional Commits)

Используем структуру сообщений:

```
<type>(optional scope): <short summary>

<long body>

BREAKING CHANGE: <description>
```

Где `<type>` один из: feat, fix, docs, style, refactor, perf, test, chore, ci, build.

Примеры:

```bash
git commit -m "feat(analytics): add GGR and NGR metrics to top dashboard"
git commit -m "docs(git): add project git guide and developer handbook"
git commit -m "fix(retention): correct AVG DEP target value"
```

Мелкие правки группируйте, избегая «шумных» коммитов.

---

#### 4) Рабочий цикл фичи

```bash
# актуализировать master
git checkout master && git pull

# создать ветку
git switch -c feature/<kebab-name>

# работать, коммитить небольшими порциями
git add -p
git commit -m "feat: ..."

# по ходу синхронизироваться
git pull --rebase origin master

# опубликовать ветку
git push -u origin feature/<kebab-name>
```

Откройте Pull Request в GitHub. Предпочтительная стратегия слияния — «Squash and merge».

---

#### 5) Обновление ветки (rebase vs merge)

- Предпочтительно: `git pull --rebase origin master` в вашей ветке — линейная история.
- Допустимо: `git merge origin/master` если конфликтов много и нужна прозрачность.

Разрешение конфликтов:

```bash
git status          # какие файлы конфликтуют
# правим файлы
git add <files>
git rebase --continue  # либо: git commit (при merge)
```

---

#### 6) Теги и релизы

Теги формата `vX.Y.Z` (SemVer) по готовности релиза:

```bash
git tag -a v0.2.0 -m "Analytics: GGR/NGR + AVG DEP"
git push origin v0.2.0
```

---

#### 7) Отмена и откат

- Отменить локальные изменения в файле:

```bash
git restore src/lib/retention-metrics-data.ts
```

- Откатить последний коммит (сохранить изменения в рабочей директории):

```bash
git reset --soft HEAD~1
```

- Создать «реверт-коммит» (без переписывания истории):

```bash
git revert <commit_sha>
```

---

#### 8) Полезные команды на каждый день

```bash
git status
git add -p
git commit
git log --oneline --graph --decorate --all | cat
git diff | cat
git blame <file> | cat
```

---

#### 9) Быстрые рецепты для этого проекта

- Добавить новую метрику в дашборд:
  1) Добавить объект в `src/lib/retention-metrics-data.ts`
  2) При необходимости включить её в блок `topMetrics` в `src/components/dashboard/full-metrics-dashboard.tsx`
  3) Обновить тексты/переводы в UI

- Массовое переименование метрик:
```bash
git grep -n "Average Deposit Amount" | cat
# правим все совпадения, коммитим одним коммитом "refactor: rename Average Deposit -> AVG DEP"
```

---

#### 10) CI/CD и защита веток (заглушка)

Если будут включены protected branches и CI, добавим сюда правила проверки и релизов.

---

#### Вопросы к владельцу

1) Нужна ли строгая политика protected branches на `master` (только через PR)?
2) Применяем ли SemVer и теги релизов официально сейчас?
3) Есть ли окружения (staging/prod) и автодеплой из веток/тегов?
4) Обязательны ли Conventional Commits или достаточно свободной формы?
5) Требуется ли подпись коммитов (GPG/DCO)?


