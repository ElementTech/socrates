# 🚁 Dynamic

`/parameters/dynamic`

{% hint style="danger" %}
Dynamic Parameters should be fast and under a few seconds if possible. It is best to use a Docker image already containing the necessary packages rather than installing them every time.
{% endhint %}

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 18.21.53.png>)

## Creating a Dynamic Parameter

To Create a Dynamic Parameter, simply Click the <mark style="background-color:blue;">Create</mark> tab, Choose a _Code Language_, write a small piece of Code to generate your output and Click <mark style="background-color:blue;">submit</mark> on the bottom.

{% hint style="info" %}
Your script should print an array of dynamic options using the following format:

`:set-output result=[a,b,c]`
{% endhint %}

#### Example in Bash:

```shell
number1=$(shuf -i 1-100000 -n 1)
number2=$(shuf -i 1-100000 -n 1)
number3=$(shuf -i 1-100000 -n 1)
echo "::set-output result=[$number1,$number2,$number3]"
```

## Testing a Dynamic Parameter

After you've created your Dynamic Parameter, click "Play" in the list. It will bring you to a small Run page, where you can show and test a default for your Parameter.&#x20;

{% hint style="info" %}
You can also tweak the code and run it, but in order to save it you'll need to click the "Edit" button in the Dynamic Parameter list.
{% endhint %}

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 18.30.10.png>)

