# 🖨 Github

## Github Integration

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 14.53.41.png>)

Click the <mark style="background-color:blue;">**Connect**</mark> Button to connect to a configuration you provided, and <mark style="background-color:red;">**Disconnect**</mark> will detach.

{% hint style="danger" %}
[Blocks](../../fundamentals/projects.md) of code attached to Github files will not lose their code after Disconnect, but they will not update farther unless reconnecting again with the same file names and paths.
{% endhint %}

<mark style="background-color:blue;">**Connecting**</mark> this form will do the following:

{% hint style="info" %}
The Webhook needs to be created [manually](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks) on the target repository. Any push to the configured Branch will update the Server automatically if it is turned on.
{% endhint %}

* Attempt to pull all files from that Branch into the Server's database.
* Update them in the "Github" page table.
* Make all files available to all code [Blocks](../../fundamentals/projects.md).
* Continuously update the files using the Webhook if Enabled.
