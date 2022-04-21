---
description: Define components as code
---

# 🗃 Configuration as YAML

In Socrates, when you connect to github, you have the ability to dynamically create components define by `.yaml` files. These files, alongside the code files describe your entire Socrates infrastructure.

![](<../../../.gitbook/assets/Screen Shot 2022-04-21 at 16.00.57.png>)

There are 4 types of Components you can make using this type of integration:

* Block (filename**.block.yaml**):

{% hint style="warning" %}
You must enable "Create dynamic/shared parameters" in the Settings page if you define a block with non-existing shared/dynamic parameters. Otherwise, the block will be added without.
{% endhint %}

```yaml
name: Example Block # Unique name of the block as will appear in the UI
lang: bash # Code language, needs to pre-exist in socrates
parameters:
  - key: textparam
    value: a text
    type: text # text parameter, not shared
    secret: true
  - key: boolparam
    value: true
    type: bool # boolean parameter
  - key: multiparam
    value:
      - option1
      - option2
      - option3
    type: multi # multiple choice parameter and options
  - key: sharedparam
    value: shared text
    secret: false
    type: shared
  - key: dynamic 
    lang: bash
    value: |
      echo "::set-output result=[a,b,c]"
    type: dynamic # dynamic parameter and options. 
    # Currently there is no default. to create a default, assign one to an instance.
script:
  github: integrations/trigger_jenkins.py # EITHER this
  code: | # OR this
    env
prescript:
  enabled: true # Enabled a pre-script in bash
  script: |
    echo this is a pre script
desc: | # description
  a block created from git integration
image: existing_icon.png # Image, if it exists
```

* Instance (filename**.instance.yaml**):

```yaml
name: Example Instance
block: Example Block # Must exist either in Github or the UI
schedule: 0/1 * * * * # optional
parameters:
    # Override a specific parameter, can be any kind except shared/dynamic
  - key: param_name 
    value: override value
desc: |
  an instance created from git integration
image: existing_icon.png
```

* Step Flow (filename**.step.yaml**):

```yaml
steps:
  - - name: Example Instance # - - two lines indicate the start of a step
    - name: Example Instance
  - - name: Example Instance
name: Example Step
schedule: 0/1 * * * * # optional
on_error: continue # continue / stop
desc: |
  a step flow created from github
image: 256.png
```

* Dag Flow (filename**.dag.yaml**):

```yaml
nodes:
  - name: Example Instance
    children:
      name: Example Instance 2
      children:
        - name: Example Instance
        - name: Example Instance 2
          children:
            - name: Example Instance
            - name: Example Instance        
  - name: Example Instance 2
    children:
      name: Example Instance      
name: Example Dag
on_error: continue # continue / branch / tree
schedule: 0/1 * * * * # optional
desc: |
  a dag flow created from github
image: test.png
```
