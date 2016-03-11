# GIT

- In order to show the differences between two branches.
  You will see which files were modified and also a brief description of what changed.

```
git diff --stat --color master..production/master 
```

- Get list of all files deleted on the git repo

```
git log --diff-filter=D --summary | grep delete
```

- See in which commits the file was modified (even deleted ones work)

```
git log --all -- app/assets/javascripts/angular/dashboard/views/profile.html.haml
```

- See all files modified in a commit

```
git diff-tree --no-commit-id --name-only -r <<COMMIT_ID>>
```


# INDEPENDENT WORKER SALARY

- Calculate your net salary, applying deductions

```javascript
  function calcularSalario(salarioBruto){
    var retencion = salarioBruto * 0.11;
    // var pension = salarioBruto * 0.07;
    // var salud = salarioBruto * 0.05;
    var pension = salarioBruto * 0.16;
    var salud = salarioBruto * 0.12;
    var deducciones = (retencion + pension + salud);
    var salarioNeto = salarioBruto - deducciones;

    console.log('Salario Bruto: ' + salarioBruto);
    console.log('-------------------------');
    console.log('Retencion: ' + retencion);
    console.log('Pension: ' + pension);
    console.log('Salud: ' + salud);
    console.log('Total deducciones: ' + deducciones);
    console.log('Salario Neto: ' + salarioNeto);
  }

```