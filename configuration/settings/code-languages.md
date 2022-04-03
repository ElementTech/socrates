# 💽 Code Languages

## Available Code Languages

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 14.16.41.png>)

Click the <mark style="background-color:blue;">**+**</mark> Button to add a new language and edit it inline inside the table. When you are done, click the <mark style="background-color:blue;">**Save**</mark> button on the top right. You can also configure private credentials for a private Docker repository.

<mark style="background-color:blue;">**Saving**</mark> this table will do the following:

* Attempt to Download the image locally to one of the Workers using the configuration you provided.
* Then:

{% hint style="success" %}
If successful, the Table will persist to the database, and the Language will be available for the Socrates components.
{% endhint %}

{% hint style="danger" %}
If not, the row will be deleted. Refresh the page after a minute to see if the image succeeded.
{% endhint %}
