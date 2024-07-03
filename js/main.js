'use strict';

/* クラスにまとめる利点
panelクラスをうまく設計すると、
・パネルに関する操作をしたい時は、panelクラスだけを見ればいい
・パネルの一部を書き換えても、パネル以外の箇所に影響を与えない
・他の箇所を書き換えても、パネルには影響はない
constructorで要素の生成をする
constはこのコンストラクターないでしか使われないためconstを使い、thisは他のメソッドでも呼び出す可能性があるからthis
constで定義した定数は{}内でしか有効にならない
constを使う利点 一般的に変数のスコープ（有効範囲）を小さくことで、読みやすくなる。
constructorでインスタンス化？
クラスから作られるオブジェクトのことをインスタンスという
constructor()で初期化でインスタンスのプロパティ(要素)が設定される
これをthisで表現する

コンストラクタは特殊なメソッドで、インスタンスが初期化されるときに呼ばれます。 初期化thisをつけて constructorの中が、インスタンス
*/
/* はい、その理由はあります。this.timeoutId = undefinedを代入することで、タイムアウトIDをリセットしています。

JavaScriptでは、setTimeout関数を使用して遅延処理を行うと、その処理に一意のIDが割り当てられます。このIDは、clearTimeout関数を使用して遅延処理をキャンセルするために使用されます。

したがって、this.timeoutId = undefinedを代入することで、遅延処理がすでに完了しているか、またはキャンセルされていることを示しています。これは、再度同じ処理を行う前に、前の処理が完了またはキャンセルされていることを確認するための一般的なパターンです。

このように、this.timeoutId = undefinedを代入することは、コードの状態を明確にし、バグを防ぐための重要なステップとなります。このパターンは、特に複雑な非同期処理を行う際に有用です。例えば、ユーザーの入力に応じてデータをフェッチするような場合などです。ユーザーが新しい入力を行うたびに、前のフェッチ処理をキャンセルし、新しいフェッチ処理を開始することができます。このとき、this.timeoutIdをチェックすることで、前のフェッチ処理がすでにキャンセルされていることを確認できます。そして、新しいフェッチ処理を安全に開始することができます。このような場合に、this.timeoutId = undefinedを代入することは非常に重要です。それにより、アプリケーションの状態を正確に管理し、予期しないバグやエラーを防ぐことができます。このような理由から、this.timeoutId = undefinedを代入することは、良いプラクティスとされています。この説明がお役に立てば幸いです。他にご質問がありましたら、お気軽にどうぞ。よろしくお願いいたします。 */
{
  class Panel {
    constructor() {
      const section = document.createElement('section');
      section.classList.add('panel');

      this.img = document.createElement('img');
      this.img.src = this.getRandomImage();

      this.timeoutId = undefined; //プロパティについてthis.timeoutIdとかくようなことは、あまりしないこで、何か代入するようなことをしたい letで初期化せずに変数を変更したら、undefinedが入るので、
      //undefined 0でもnullでもできる

      this.stop = document.createElement('div');
      this.stop.textContent = 'STOP';
      this.stop.classList.add('stop', 'inactive');
      this.stop.addEventListener('click', () => {
        if (this.stop.classList.contains('inactive')) {
          return;
        }
        this.stop.classList.add('inactive');
        clearTimeout(this.timeoutId);

        panelsLeft--;  //これはパネルのことについてだから、クラス内にかく

        if (panelsLeft === 0) {
          spin.classList.remove('inactive');
          panelsLeft = 3;
          checkResult(); //チェックリザルトはパネルに直接関係するわけではないので関数の内容は外にカク
        }
      });

      section.appendChild(this.img);
      section.appendChild(this.stop);

      const main = document.querySelector('main');
      main.appendChild(section);
    }

   /////////////コンストラクタはここまで//////////

  
    //Math.random() 0-1 Math.random() * 3 → 0 - 3
    // Math.floor 小数点以下切り捨て

    getRandomImage() {
      const images = [
       'img/seven.png',
       'img/bell.png',
       'img/cherry.png',
      ];
      return images[Math.floor(Math.random() * images.length)];
    }

     //setTimeout 50ミリ秒後に次の処理をする またspinを呼び出せば、繰り返しになる これから始まる
    spin() {
      this.img.src = this.getRandomImage();
      this.timeoutId = setTimeout(() => { 
         this.spin();
      }, 50);
    }

    isUnmatched(p1, p2) {
      // if (this.img.src !== p1.img.src && this.img.src !== p2.img.src ) {
      //   return true; //trueということは、
      // } else {
      //   return false;
      // }
      return this.img.src !== p1.img.src && this.img.src !== p2.img.src;
    }

    unmatch() {
      this.img.classList.add('unmatched');
    }

    activate() {
      this.img.classList.remove('unmatched');
      this.stop.classList.remove('inactive');
    }

  }

  //////////クラスはここまで////////

  function checkResult() {
    if (panels[0].isUnmatched(panels[1], panels[2])) {
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0], panels[2])) {
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[0], panels[1])) {
      panels[2].unmatch();
    }
  }

  const panels = [
    new Panel(),  //オブジェクト
    new Panel(),
    new Panel(),
  ];

  let panelsLeft = 3;

  const spin = document.getElementById('spin');
  spin.addEventListener('click', () => {
    if (spin.classList.contains('inactive')) {
      return; //止める
    }
    spin.classList.add('inactive');
    panels.forEach(panel => {
      panel.activate();
      panel.spin();
    });
  });
}