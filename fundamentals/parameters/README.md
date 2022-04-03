# 📓 Parameters

Each [Block](../projects.md) and its [Instance](../instances/) have "parameters" which always include defaults. These are basically translated as Strings (Environment Variables) inside the execution of any code language in its virtual machine. For example, inside a Python script:

```python
environ({
'test': '98546', 
'HOSTNAME': 'b570e06f96ad', 
'stamtexty': 'fdasfs', 
'PYTHON_PIP_VERSION': '22.0.4', 
'HOME': '/root', 
'GPG_KEY': 'A035C8C19219BA821ECEA86B64E628F8D684696D', 
'myoutput': 'fcknfajozc', 
'PYTHON_GET_PIP_URL': 
'https://github.com/pypa/get-pip/raw/38e54e5de07c66e875c11a1ebbdb938854625dd8/public/get-pip.py', 
'fasd': '7gg', 
'PATH': '/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', 
'LANG': 'C.UTF-8', 
'stam2': 'true', 
'PYTHON_VERSION': '3.10.4', 
'PYTHON_SETUPTOOLS_VERSION': 
'58.1.0', 
'stam6': '2', 
'PWD': '/run', 
'PYTHON_GET_PIP_SHA256': 'e235c437e5c7d7524fbce3880ca39b917a73dc565e0c813465b7a7a329bb279a'
})
```

Changing a Shared or Dynamic parameter will propagate changes to all Components who use it.

These are the following types of parameters:

<table><thead><tr><th>Type</th><th>Value</th><th data-type="checkbox">Can Be Secret</th><th data-type="checkbox">Can Be Shared</th><th>Info</th></tr></thead><tbody><tr><td>Text</td><td>String</td><td>true</td><td>true</td><td>Shared text parameters can be defined in <code>/parameters/shared</code></td></tr><tr><td>Boolean</td><td>Checkbox</td><td>false</td><td>false</td><td></td></tr><tr><td>Multi Choice</td><td>Comma Separated String</td><td>false</td><td>false</td><td></td></tr><tr><td><a href="dynamic.md">Dynamic</a></td><td>Comma Separated String (From Code)</td><td>false</td><td>true</td><td>Dynamic parameters can be defined in <code>/parameters/dynamic</code></td></tr></tbody></table>

